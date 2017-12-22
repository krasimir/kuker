// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';
import UnrecognizedEvent from './handlers/UnrecognizedEvent';
import { Handlers, StentHandlers } from './Handlers';
import getRandomColor from '../../helpers/getRandomColor';

const sourceBorderColors = (function (num) {
  let borders = [];

  for (let i = 0; i < num; i++) {
    borders.push(`${ Math.round(Math.random() * 10) * 0.3 }px solid ${ getRandomColor() }`);
  }
  return borders;
})(50);

const bordersBuffer = {};
const getBorder = function (source) {
  if (!bordersBuffer[source]) bordersBuffer[source] = sourceBorderColors.shift();
  return bordersBuffer[source];
};

export default function EventListRow({ event, pinnedEvent, pin, sources }) {
  const { type, withMarker } = event;
  // eslint-disable-next-line no-unused-vars
  const shortType = type.split('_')[0];
  const Component = StentHandlers[type] || Handlers[type] || Handlers[shortType] || UnrecognizedEvent;
  const isPinned = (pinnedEvent || {})['id'] === event.id;

  const className =
    (type ? type : '') +
    ' actionRow relative' +
    (withMarker ? ' withMarker' : '') +
    (isPinned ? ' pinned' : '') +
    (event.stateMutation ? ' mutatingState' : '') +
    (event.mutationExplorer ? ' mutationExplorer' : '');

  const style = sources && Object.keys(sources).length === 0 ? {} : {
    borderLeft: getBorder(event.origin)
  };

  return (
    <li style={ style }>
      <Component
        key={ event.id }
        className={ className }
        onClick={ () => pin(event.id) }
        event={ event }
      />
    </li>
  );
};

EventListRow.propTypes = {
  event: PropTypes.object,
  pinnedEvent: PropTypes.object,
  pin: PropTypes.func,
  sources: PropTypes.object
};
