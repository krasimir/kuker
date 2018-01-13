/* eslint-disable no-unused-vars */
import React from 'react';
// import JSONTree from 'react-json-tree';
import JSONTree from '../../vendor/react-json-tree/lib';
import renderJSONPreview from './renderJSONPreview';

const treeTheme = {
  extend: {
    scheme: 'chalk',
    author: 'chris kempson (http://chriskempson.com)',
    base00: '#151515',
    base01: '#202020',
    base02: '#303030',
    base03: '#505050',
    base04: '#b0b0b0',
    base05: '#d0d0d0',
    base06: '#e0e0e0',
    base07: '#f5f5f5',
    base08: '#fb9fb1',
    base09: '#eda987',
    base0A: '#ddb26f',
    base0B: '#acc267',
    base0C: '#12cfc0',
    base0D: '#6fc2ef',
    base0E: '#e1a3ee',
    base0F: '#deaf8f'
  },
  tree: {
    backgroundColor: '#e6e6e6',
    marginTop: 2,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0
  },
  nestedNodeLabel: ({ style }, expanded) => ({
    style: {
      ...style,
      color: expanded ? '#000' : '#000'
    }
  })
};
const treeNodesState = {};

function getPathFromKey(key) {
  if (!key) return false;
  return key.slice(0, key.length - 1).reverse().join('.');
}
function labelRenderer(what, onItemClick, mutationExplorerPath) {
  const viewMutation = (event, path) => {
    event.stopPropagation();
    if (path) {
      onItemClick(path);
    }
  };

  return function labelRenderer(key, parentKey, expanded, rootKey) {
    const path = getPathFromKey(key);
    const style = path === mutationExplorerPath ? {
      color: '#f00'
    } : {};
    const clickMeIcon = onItemClick !== null ?
      (<a onClick={ event => viewMutation(event, path) } style={{ textIndent: 0 }}>
        <i className='fa fa-eye viewMutationIcon'></i>
      </a>) :
      null;

    if (key[0] === 'root' && (parentKey === 'Object' || parentKey === 'Array') && rootKey === true) {
      return what;
    }
    return <span style={ style }><strong>{ key[0] }</strong>{ clickMeIcon }</span>;
  };
}
function shouldExpandNode(keyName, data, level) {
  if (treeNodesState[keyName.join('.')]) return true;
  if (level < 1) return true;
  return false;
}
function valueRenderer(raw) {
  return <em>{ raw }</em>;
}

function getItemString(type, data, itemType, itemString) {
  if (data !== null && data !== undefined) {
    return <span>{ renderJSONPreview(data) }</span>;
  }
  return null;
};

const renderJSON = function (json, what = 'root', onItemClick = null, mutationExplorerPath) {
  return <JSONTree
    data={ json }
    theme={ treeTheme }
    getItemString={ getItemString }
    labelRenderer={ labelRenderer(what, onItemClick, mutationExplorerPath) }
    shouldExpandNode={ shouldExpandNode }
    valueRenderer={ valueRenderer }
    hideRoot={ false }
    onItemCollapsed={ keyPath => (delete treeNodesState[keyPath.join('.')]) }
    onItemExpanded={ keyPath => (treeNodesState[keyPath.join('.')] = true) }
  />;
};

export default renderJSON;
