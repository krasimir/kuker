import React from 'react';
import PropTypes from 'prop-types';
import Tree from './Tree';
import { connect } from 'stent/lib/react';
import JSONMutation from './JSONMutation';

var filteredTreesCache = {};

const extractFilteredTrees = function (root, filter, result = []) {
  if (!root || typeof root !== 'object') return result;
  Object.keys(root).forEach(key => {
    if (root[key] && typeof root[key] === 'object' && key.match(filter)) {
      result.push({ [key]: root[key] });
      if (Array.isArray(root[key])) {
        result = root[key].reduce((soFar, child) => {
          soFar = soFar.concat(extractFilteredTrees(child, filter));
          return soFar;
        }, result);
      } else {
        result = result.concat(extractFilteredTrees(root[key], filter));
      }
    } else {
      if (key.match(filter)) {
        result.push({ [key]: root[key] });
      }
      result = result.concat(extractFilteredTrees(root[key], filter));
    }
  });
  return result;
};

class JSONTree extends React.Component {
  constructor(props) {
    super(props);

    this.state = { mutationExplorerPath: null };
    this._showMutation = this._showMutation.bind(this);
  }
  _showMutation(mutationExplorerPath) {
    if (mutationExplorerPath === this.state.mutationExplorerPath) {
      this.props.clearMutation();
      this.setState({ mutationExplorerPath: null });
    } else {
      this.props.showMutation(mutationExplorerPath);
      this.setState({ mutationExplorerPath });
    }
  }
  render() {
    const { mutationExplorerPath, pinnedEvent, filter } = this.props;
    var trees = [];

    if (filter !== '') {
      const cacheId = filter + pinnedEvent.id;

      if (!filteredTreesCache[cacheId]) {
        filteredTreesCache = {
          [cacheId]: extractFilteredTrees(pinnedEvent.state, new RegExp(`^${ filter }`, 'ig'))
        };
      }
      trees = filteredTreesCache[cacheId];
    } else {
      trees = [ pinnedEvent.state ];
    }

    return (
      <div className='logRightContentWrapper'>
        <div className='logTree'>
          {
            trees.map((tree, i) =>
              <div key={ i } className='filteredTreeResult'>
                <Tree data={ tree } onItemClick={ this._showMutation } mutationExplorerPath={ mutationExplorerPath } />
              </div>
            )
          }
          <JSONMutation mutations={ pinnedEvent.stateMutation } filter={ filter }/>
        </div>
      </div>
    );
  }
}

JSONTree.propTypes = {
  pinnedEvent: PropTypes.object,
  mutationExplorerPath: PropTypes.string,
  filter: PropTypes.string,
  showMutation: PropTypes.func,
  clearMutation: PropTypes.func
};

export default connect(JSONTree)
  .with('DevTools', 'Pinned')
  .map((devtools, pinned) => ({
    showMutation: devtools.showMutation,
    clearMutation: devtools.clearMutation,
    mutationExplorerPath: devtools.state.mutationExplorerPath,
    pinnedEvent: pinned.state.pinnedEvent,
    filter: devtools.state.quickFilters.right
  }));
