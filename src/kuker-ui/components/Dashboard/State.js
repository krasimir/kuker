import React from 'react';
import PropTypes from 'prop-types';
import HTMLTree from '../HTMLTree';
import JSONTree from '../JSONTree';
import ReactEvent from './Handlers/React';
import AngularEvent from './Handlers/Angular';
import VueEvent from './Handlers/Vue';
import HTMLPin from './HTMLPin';

export default function State({ pinnedEvent }) {
  if (
    ReactEvent.isReactEvent(pinnedEvent) ||
    AngularEvent.isAngularEvent(pinnedEvent) ||
    VueEvent.isVueEvent(pinnedEvent)
  ) {
    return <HTMLTree Pin={ HTMLPin }/>;
  }
  return <JSONTree />;
}

State.propTypes = {
  pinnedEvent: PropTypes.object
};
