import React from 'react';
import PropTypes from 'prop-types';
import HTMLTree from '../HTMLTree';
import JSONTree from '../JSONTree';
import ReactEvent from './Handlers/React';
import AngularEvent from './Handlers/Angular';

export default function State({ pinnedEvent }) {
  if (ReactEvent.isReactEvent(pinnedEvent) || AngularEvent.isAngularEvent(pinnedEvent)) {
    return <HTMLTree />;
  }
  return <JSONTree />;
}

State.propTypes = {
  pinnedEvent: PropTypes.object
};
