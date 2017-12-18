import { Machine } from 'stent';
import { PAGES } from '../constants';
import { enhanceEvent } from '../helpers/enhanceEvent';
import calculateMutationExplorer from '../helpers/calculateMutationExplorer';

const getFilterTypes = function () {
  const types = localStorage.getItem('filterTypes');

  if (types !== null) {
    return JSON.parse(types);
  }
  return null;
};
const setFilterTypes = function (types) {
  return localStorage.setItem('filterTypes', JSON.stringify(types));
};

const initialState = () => ({
  name: 'working',
  page: PAGES.DASHBOARD,
  events: [],
  mutationExplorerPath: null,
  filterTypes: getFilterTypes()
});
const MAX_EVENTS = 400;

const DevTools = Machine.create('DevTools', {
  state: initialState(),
  transitions: {
    'working': {
      'action received': function ({ events, ...rest }, newEvents) {
        const eventsToAdd = newEvents.map((newEvent, i) => {
          if (typeof newEvent.type === 'undefined') {
            return false;
          }
          const enhancedEvent = enhanceEvent(newEvent, this.lastKnownState, rest.mutationExplorerPath);

          if (newEvent.state) {
            this.lastKnownState = newEvent.state;
          }

          return enhancedEvent;
        }).filter(newEvent => newEvent);

        if (eventsToAdd.length === 0) return undefined;

        events = events.concat(eventsToAdd);
        if (events.length > MAX_EVENTS) {
          events.splice(0, events.length - MAX_EVENTS);
        }

        return {
          events: events,
          ...rest
        };
      },
      'flush events': function () {
        return initialState();
      },
      'show mutation': function ({ events, ...rest }, mutationExplorerPath) {
        events.forEach(event => calculateMutationExplorer(event, mutationExplorerPath));

        return { events, ...rest, mutationExplorerPath };
      },
      'clear mutation': function ({ events, mutationExplorerPath, ...rest}) {
        events.forEach(event => (event.mutationExplorer = false));
        return { events, ...rest, mutationExplorerPath: null };
      },
      'update filter types': function ({ filterTypes, events, ...rest }, update) {
        const newFilterTypes = Object.assign({}, filterTypes, update);

        setFilterTypes(newFilterTypes);
        return {
          ...rest,
          events: events, newFilterTypes,
          filterTypes: newFilterTypes
        };
      }
    }
  },
  getFilteredEvents() {
    const filterTypes = this.state.filterTypes;

    return this.state.events.filter(({ type }) => {
      if (filterTypes !== null && typeof filterTypes[type] !== 'undefined') {
        return filterTypes[type];
      }
      return true;
    });
  }
});

export default DevTools;
