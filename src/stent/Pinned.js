import { Machine } from 'stent';
import { connect } from 'stent/lib/helpers';
import isDefined from '../helpers/isDefined';

function pin({ name, events, pinnedEvent: currentPinnedEvent }, eventId) {
  var pinnedEvent;
  var newState = name;

  if (isDefined(eventId)) {
    pinnedEvent = events.find(({ id }) => id === eventId);
    newState = pinnedEvent.id === events[events.length - 1].id ? 'auto' : 'fixed';
  } else {
    pinnedEvent = name === 'auto' ? events[events.length - 1] : currentPinnedEvent;
    if (name === 'fixed' && !events.find(({ id }) => id === pinnedEvent.id)) {
      pinnedEvent = events[events.length - 1];
      name = 'auto';
    }
  }
  return { name: newState, pinnedEvent, events };
}
function setEvents({ events: oldEvents, ...rest }, events) {
  return pin({ events, ...rest });
}

function addMarker(state) {
  if (state.pinnedEvent) {
    state.pinnedEvent.withMarker = true;
  }
  return state;
}

const actions = {
  pin,
  'add Marker': addMarker,
  'set events': setEvents
};
const pinned = Machine.create('Pinned', {
  state: { name: 'auto', pinnedEvent: undefined, events: null },
  transitions: {
    auto: actions,
    fixed: actions
  }
});

connect().with('DevTools').map(devTools => pinned.setEvents(devTools.getFilteredEvents()));

export default pinned;
