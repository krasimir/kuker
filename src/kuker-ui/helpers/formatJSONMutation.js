/* eslint-ignore max-len */
import React from 'react';
import PropTypes from 'prop-types';
import renderJSONPreview from './renderJSONPreview';
import ExpandablePath from './ExpandablePath';

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
function formatPath(mutation) {
  const index = mutation.kind === 'A' ? `[ ${ mutation.index } ] ` : null;
  const path = mutation.path;

  if (path) {
    const full = path.join('.');
    const short = path.slice(path.length - 4, path.length).join('.');

    if (path.length > 4) {
      return <strong>{ index } <ExpandablePath full={ full } short={ short }/></strong>;
    }
    return <strong>{ index }{ full }</strong>;
  } else if (mutation.kind === 'A') {
    return <strong>{ index }</strong>;
  }
  return <span className='mutationLine'></span>;
}
function formatItem(mutation, indent = 0) {
  if (!mutation) return null;
  return (
    <div style={{ marginLeft: (indent * 1.5) + 'em' }}>
      <div>
        { formatKind(mutation.kind) }
        { formatPath(mutation) }
        { mutation.kind === 'A' && formatItem(mutation.item, indent + 1) }
      </div>
      <div style={{ marginLeft: '1.2em' }}>
        { isDefined(mutation.lhs) && formatSide(mutation.lhs) }
        { isDefined(mutation.rhs) && <span> <i className='fa fa-long-arrow-right'></i> { formatSide(mutation.rhs) }</span> }
      </div>
    </div>
  );
}

export default function formatJSONMutation(mutations) {
  if (!mutations) return null;

  return (
    <div className='stateMutation'>
      <div className='diff'></div>
      {
        mutations.map((mutation, i) => <div key={i}>{ formatItem(mutation) }</div>)
      }
    </div>
  );
};

formatJSONMutation.PropTypes = {
  mutations: PropTypes.object
};

export function extractMutatedPaths(mutation) {
  return mutation.map(({ path, item }) => {
    if (path) return path.join('.');
    if (item) return extractMutatedPaths([ item ]);
    return '';
  });
};
