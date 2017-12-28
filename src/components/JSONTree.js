import React from 'react';
import PropTypes from 'prop-types';
import Tree from './Tree';
import { connect } from 'stent/lib/react';
import formatStateMutation from '../helpers/formatStateMutation';
import MutationPin from './Dashboard/MutationPin';

class JSONTree extends React.Component {
  render() {
    const { mutationExplorerPath, pinnedEvent, showMutation } = this.props;

    return (
      <div className={ 'logRightContentWrapper' + (mutationExplorerPath ? ' withDetails' : '') }>
        <div className='logTree'>
          <Tree
            data={ pinnedEvent.state }
            onItemClick={ showMutation } />
          { formatStateMutation(pinnedEvent.stateMutation) }
        </div>
        <div className='logDetails'>
          <MutationPin />
        </div>
      </div>
    );
  }
}

JSONTree.propTypes = {
  pinnedEvent: PropTypes.object,
  mutationExplorerPath: PropTypes.string,
  showMutation: PropTypes.func
};

export default connect(JSONTree)
  .with('DevTools', 'Pinned')
  .map((devtools, pinned) => ({
    showMutation: devtools.showMutation,
    mutationExplorerPath: devtools.state.mutationExplorerPath,
    pinnedEvent: pinned.state.pinnedEvent
  }));
