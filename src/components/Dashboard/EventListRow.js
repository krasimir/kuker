// eslint-disable-next-line no-unused-vars
import React from 'react';
import UnrecognizedEvent from './handlers/UnrecognizedEvent';
import { Handlers, StentHandlers } from './Handlers';

export default function EventListRow({ event, pinnedEvent, pin }) {
  const { type, withMarker } = event;
  // eslint-disable-next-line no-unused-vars
  const Component = StentHandlers[type] || Handlers[type] || UnrecognizedEvent;
  const isPinned = (pinnedEvent || {})['id'] === event.id;

  const className =
    (type ? type : '') +
    ' actionRow relative' +
    (withMarker ? ' withMarker' : '') +
    (isPinned ? ' pinned' : '');

  return (
    <Component
      key={ event.id }
      className={ className }
      onClick={ () => pin(event.id) }
      event={ event }
    />
  );
};
