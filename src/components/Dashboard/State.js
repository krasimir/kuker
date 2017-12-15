import React from 'react';
import PropTypes from 'prop-types';
import Tree from '../Tree';
import { StentHandlers } from './Handlers';
import { renderMachinesAsTree } from '../../helpers/renderAsTree';
import formatStateMutation from '../../helpers/formatStateMutation';
import { connect } from 'stent/lib/react';

function State({ event, showMutation }) {
  const renderer = event && event.type in StentHandlers ? renderMachinesAsTree : null;

  return (
    <div>
      <Tree
        data={ event.state }
        renderer={ renderer }
        onItemClick={ showMutation } />
      { formatStateMutation(event.stateMutation) }
    </div>
  );
}

State.propTypes = {
  event: PropTypes.object,
  showMutation: PropTypes.func
};

export default connect(State).with('DevTools').map(({ showMutation }) => ({
  showMutation
}));
