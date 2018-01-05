/* eslint-ignore max-len */
import React from 'react';
import PropTypes from 'prop-types';
import renderJSONPreview from './renderJSONPreview';

/*
kind - indicates the kind of change; will be one of the following:
  N - indicates a newly added property/element
  D - indicates a property/element was deleted
  E - indicates a property/element was edited
  A - indicates a change occurred within an array
path - the property path (from the left-hand-side root)
lhs - the value on the left-hand-side of the comparison (undefined if kind === 'N')
rhs - the value on the right-hand-side of the comparison (undefined if kind === 'D')
index - when kind === 'A', indicates the array index where the change occurred
item - when kind === 'A', contains a nested change record indicating the change that occurred at the array index
*/

function isDefined(value) {
  return typeof value !== 'undefined';
}
function mapPathToItem(tree, path, lastWithName, lastTrackedPath = []) {
  if (path.length === 0) {
    return { item: lastWithName || tree, mutationPath: lastTrackedPath };
  };
  const propName = path.shift();
  const item = tree[propName];

  lastTrackedPath.push(propName);

  if (item) {
    if (isDefined(item.name)) {
      lastWithName = item;
      lastTrackedPath = [];
    }
    return mapPathToItem(item, path, lastWithName, lastTrackedPath);
  }
  return { item: tree, mutationPath: lastTrackedPath };
}
function formatKind(kind) {
  switch (kind) {
    case 'N': return <i className={ 'fa fa-plus-square ' + kind }></i>;
    case 'D': return <i className={ 'fa fa-minus-square ' + kind }></i>;
    case 'E': return <i className={ 'fa fa-pencil ' + kind }></i>;
    case 'A': return <i className={ 'fa fa-ellipsis-h ' + kind }></i>;
  }
  return '';
}
function formatSide(side) {
  if (typeof side === 'object' && side !== null) {
    return renderJSONPreview(side);
  }
  return String(side);
}
function formatPath(mutation, state) {
  const index = mutation.kind === 'A' ? `[ ${ mutation.index } ] ` : null;
  const path = mutation.path;

  if (path) {
    const { item, mutationPath } = mapPathToItem(state, path.slice(0));
    const result = [];

    if (item && item.name) {
      result.push(<strong key='tag'>&lt;{ item.name }&gt;</strong>);
    }
    if (mutationPath && mutationPath.length > 0) {
      if (mutationPath.length > 3) {
        result.push(<span key='mp'>......{ mutationPath.splice(mutationPath.length - 3, 3).join('.') }</span>);
      } else {
        result.push(<span key='mp'>.{ mutationPath.join('.') }</span>);
      }
    }
    return result;
  } else if (mutation.kind === 'A') {
    return <strong>{ index }</strong>;
  }
  return <span className='mutationLine'></span>;
}
function formatItem(mutation, indent, state) {
  if (!mutation) return null;

  return (
    <div style={{ marginLeft: (indent * 1.5) + 'em' }}>
      <div>
        { formatKind(mutation.kind) }
        { formatPath(mutation, state) }
        { mutation.kind === 'A' && formatItem(mutation.item, indent + 1, state) }
      </div>
      <div style={{ marginLeft: '1.2em' }}>
        { isDefined(mutation.lhs) && formatSide(mutation.lhs) }
        { isDefined(mutation.rhs) && <span> <i className='fa fa-long-arrow-right'></i> { formatSide(mutation.rhs) }</span> }
      </div>
    </div>
  );
}

export default function formatHTMLMutation(pinnedEvent) {
  const mutations = pinnedEvent.stateMutation;

  if (!mutations) return null;

  return (
    <div className='stateMutation'>
      <div className='diff'></div>
      {
        mutations.map((mutation, i) => <div key={i}>{ formatItem(mutation, 0, pinnedEvent.state) }</div>)
      }
    </div>
  );
};

formatHTMLMutation.PropTypes = {
  mutations: PropTypes.object
};
