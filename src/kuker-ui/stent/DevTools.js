import { Machine } from 'stent';
import { PAGES, DEFAULT_FILTER_TYPES } from '../constants';
import { enhanceEvent } from '../helpers/enhanceEvent';
import calculateMutationExplorer from '../helpers/calculateMutationExplorer';

var ls = null;

(function () {
  var test = 'test';

  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    ls = localStorage;
  } catch (e) {
    ls = false;
  }
})();

const getLocalStorage = function () {
  return ls ? ls : {
    getItem: () => null,
    setItem: () => null
  };
};

const getFilterTypes = function () {
  const types = getLocalStorage().getItem('kuker_filterTypes');

  if (types !== null) {
    try {
      return JSON.parse(types);
    } catch (error) {
      return DEFAULT_FILTER_TYPES;
    }
  }
  return DEFAULT_FILTER_TYPES;
};
const getSources = function () {
  const sources = getLocalStorage().getItem('kuker_sources');

  if (sources !== null) {
    try {
      return JSON.parse(sources);
    } catch (error) {
      return null;
    }
  }
  return null;
};
const setFilterTypes = function (types) {
  try {
    return getLocalStorage().setItem('kuker_filterTypes', JSON.stringify(types));
  } catch (error) {
    return {};
  }
};
const setSources = function (sources) {
  try {
    return getLocalStorage().setItem('kuker_sources', JSON.stringify(sources));
  } catch (error) {
    return {};
  }
};

const initialState = () => ({
  name: 'working',
  page: PAGES.DASHBOARD,
  events: [],
  mutationExplorerPath: null,
  filterTypes: getFilterTypes(),
  sources: getSources(),
  quickFilters: { left: '', right: '' }
});
const MAX_EVENTS = 1000;

const DevTools = Machine.create('DevTools', {
  state: initialState(),
  transitions: {
    'working': {
      'action received': function ({ events, ...rest }, newEvents) {
        const eventsToAdd = newEvents.map((newEvent, i) => {
          if (typeof newEvent.type === 'undefined') {
            return false;
          }
          const enhancedEvent = enhanceEvent(
            newEvent,
            this.lastKnownState[newEvent.emitter],
            rest.mutationExplorerPath
          );

          if (newEvent.state) {
            this.lastKnownState[newEvent.emitter] = newEvent.state;
          }

          return enhancedEvent;
        }).filter(newEvent => newEvent);

        if (eventsToAdd.length === 0) return undefined;

        events = events.concat(eventsToAdd);
        if (events.length > MAX_EVENTS) {
          events.splice(0, events.length - MAX_EVENTS);
        }

        return {
          events,
          ...rest
        };
      },
      'flush events': function ({ quickFilters }) {
        return Object.assign({}, initialState(), {
          quickFilters
        });
      },
      'show mutation': function ({ events, ...rest }, mutationExplorerPath) {
        events.forEach(event => calculateMutationExplorer(event, mutationExplorerPath));

        return { events, ...rest, mutationExplorerPath };
      },
      'clear mutation': function ({ events, mutationExplorerPath, ...rest}) {
        events.forEach(event => (event.mutationExplorer = false));
        return { events, ...rest, mutationExplorerPath: null };
      },
      'update filters': function (state, { filterTypes, sources }) {
        const newFilterTypes = Object.assign({}, state.filterTypes, filterTypes);
        const newSources = Object.assign({}, state.sources, sources);

        setFilterTypes(newFilterTypes);
        setSources(newSources);
        return {
          ...state,
          filterTypes: newFilterTypes,
          sources: newSources
        };
      },
      'update quick filters': function ({ quickFilters, ...rest }, whichOne, value) {
        return { ...rest, quickFilters: { ...quickFilters, [whichOne]: value } };
      }
    }
  },
  getFilteredEvents() {
    const filterTypes = this.state.filterTypes;
    const sources = this.state.sources;
    const filterRegExp = this.state.quickFilters.left !== '' ? new RegExp(this.state.quickFilters.left, 'gi') : false;

    const filteredByTypeAndSource = this.state.events
      .filter(({ type }) => {
        if (filterTypes !== null && typeof filterTypes[type] !== 'undefined') {
          return filterTypes[type];
        }
        return true;
      })
      .filter(({ origin }) => {
        if (sources !== null && typeof sources[origin] !== 'undefined') {
          return sources[origin];
        }
        return true;
      });

    if (filterRegExp) {
      return filteredByTypeAndSource.filter(({ state, ...rest }) => {
        try {
          return JSON.stringify(rest).match(filterRegExp);
        } catch (error) {
          return false;
        }
      });
    }
    return filteredByTypeAndSource;
  },
  lastKnownState: {}
});

export default DevTools;
