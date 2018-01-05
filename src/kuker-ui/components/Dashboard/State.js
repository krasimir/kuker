import React from 'react';
import PropTypes from 'prop-types';
import HTMLTree from '../HTMLTree';
import JSONTree from '../JSONTree';
import ReactEvent from './Handlers/React';

export default function State({ pinnedEvent }) {
  if (ReactEvent.isReactEvent(pinnedEvent)) {
    return <HTMLTree />;
  }
  return <JSONTree />;
}

State.propTypes = {
  pinnedEvent: PropTypes.object
};
