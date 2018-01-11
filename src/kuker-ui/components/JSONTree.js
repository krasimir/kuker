import React from 'react';
import PropTypes from 'prop-types';
import Tree from './Tree';
import { connect } from 'stent/lib/react';
import JSONMutation from './JSONMutation';
import MutationPin from './Dashboard/MutationPin';

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
  render() {
    const { mutationExplorerPath, pinnedEvent, showMutation, filter } = this.props;
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
      <div className={ 'logRightContentWrapper' + (mutationExplorerPath ? ' withDetails' : '') }>
        <div className='logTree'>
          {
            trees.map((tree, i) =>
              <div key={ i } className='filteredTreeResult'>
                <Tree data={ tree } onItemClick={ showMutation } />
              </div>
            )
          }
          <JSONMutation mutations={ pinnedEvent.stateMutation } filter={ filter }/>
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
  filter: PropTypes.string,
  showMutation: PropTypes.func
};

export default connect(JSONTree)
  .with('DevTools', 'Pinned')
  .map((devtools, pinned) => ({
    showMutation: devtools.showMutation,
    mutationExplorerPath: devtools.state.mutationExplorerPath,
    pinnedEvent: pinned.state.pinnedEvent,
    filter: devtools.state.quickFilters.right
  }));
