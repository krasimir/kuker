import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'stent/lib/react';

function MutationPin({ clearMutation, mutationExplorerPath }) {
  if (!mutationExplorerPath) return null;

  return (
    <div className='mutationContainer'>
      <strong>{ mutationExplorerPath }.*</strong>
      <small>
        <a onClick={ clearMutation }> (<i className='fa fa-times'></i> clear)</a>
      </small>
    </div>
  );
};

MutationPin.propTypes = {
  clearMutation: PropTypes.func,
  children: PropTypes.func,
  mutationExplorerPath: PropTypes.string
};

export default connect(MutationPin).with('DevTools').map(
  ({ state, clearMutation }) => ({
    mutationExplorerPath: state.mutationExplorerPath,
    clearMutation
  })
);
