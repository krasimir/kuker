import { Machine } from 'stent';
import { PAGES } from '../constants';
import { normalizeEvent } from '../helpers/normalize';

const initialState = () => ({
  name: 'working',
  page: PAGES.DASHBOARD,
  events: [],
  pinnedEvent: null,
  autoscroll: true,
  healthy: false
});
const MAX_EVENTS = 400;

const DevTools = Machine.create('DevTools', {
  state: initialState(),
  transitions: {
    'working': {
      'action received': function ({ events, autoscroll, pinnedEvent, healthy, ...rest }, newEvents) {
        if (newEvents.length === 1 && newEvents[0].pageRefresh === true) {
          this.flushEvents(); return undefined;
        }
        if (newEvents.length === 1 && newEvents[0].healthy === true) {
          return { events, autoscroll, pinnedEvent, healthy: newEvents[0].healthy.status, ...rest };
        }
        if (newEvents.length === 1 && newEvents[0].pageRefresh === true) {
          this.flushEvents(); return undefined;
        }
        const eventsToAdd = newEvents.map(newEvent => {
          if (typeof newEvent.type === 'undefined') {
            return false;
          }
          return normalizeEvent(newEvent);
        }).filter(newEvent => newEvent);

        if (eventsToAdd.length === 0) return undefined;

        events = events.concat(eventsToAdd);
        if (events.length > MAX_EVENTS) {
          events.splice(0, events.length - MAX_EVENTS);
        }

        if (autoscroll) {
          pinnedEvent = events[events.length - 1];
        }

        return {
          events,
          autoscroll,
          pinnedEvent,
          healthy,
          ...rest
        };
      },
      'flush events': function () {
        return initialState();
      },
      'add marker': function (state) {
        if (state.pinnedEvent) {
          state.pinnedEvent.withMarker = true;
        }
        return state;
      },
      'pin': function ({ events, pinnedEvent: currentPinnedEvent, ...rest }, id) {
        const event = this.getEventById(id);
        const autoscroll = event.id === events[events.length - 1].id;

        return {
          ...rest,
          autoscroll,
          pinnedEvent: event ? event : currentPinnedEvent,
          events
        };
      }
    }
  },
  getEventById(eventId) {
    return this.state.events.find(({ id }) => id === eventId);
  }
});

export default DevTools;
