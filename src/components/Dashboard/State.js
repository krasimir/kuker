import React from 'react';
import PropTypes from 'prop-types';
import Tree from '../Tree';
import HTMLTree from '../HTMLTree';
import { StentHandlers } from './Handlers';
import { renderMachinesAsTree } from '../../helpers/renderAsTree';
import formatStateMutation from '../../helpers/formatStateMutation';
import { connect } from 'stent/lib/react';
import ReactEvent from './Handlers/React';

function State({ pinnedEvent, showMutation }) {
  const renderer = event && event.type in StentHandlers ? renderMachinesAsTree : null;

  if (ReactEvent.isReactEvent(pinnedEvent)) {
    return <HTMLTree />;
  }

  return (
    <div>
      <Tree
        data={ pinnedEvent.state }
        renderer={ renderer }
        onItemClick={ showMutation } />
      { formatStateMutation(pinnedEvent.stateMutation) }
    </div>
  );
}

State.propTypes = {
  pinnedEvent: PropTypes.object,
  showMutation: PropTypes.func
};

export default connect(State).with('DevTools').map(({ showMutation }) => ({
  showMutation
}));
