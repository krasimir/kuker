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
function getMutationIcon(kind) {
  switch (kind) {
    case 'N': return <i className={ 'fa fa-plus-square ' + kind }></i>;
    case 'D': return <i className={ 'fa fa-minus-square ' + kind }></i>;
    case 'E': return <i className={ 'fa fa-pencil ' + kind }></i>;
    case 'A': return <i className={ 'fa fa-pencil ' + kind }></i>;
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
  const index = mutation.kind === 'A' ? `[${ mutation.index }] ` : null;
  const path = mutation.path;

  if (path) {
    const full = path.join('.');
    const short = path.slice(path.length - 4, path.length).join('.');

    if (path.length > 4) {
      return <strong><ExpandablePath full={ full } short={ short }/>{ index }</strong>;
    }
    return <strong>{ full }{ index }</strong>;
  } else if (mutation.kind === 'A') {
    return <strong>{ index }</strong>;
  }
  return null;
}
function formatSingleMutation(mutation, indent = 0) {
  var mutationBit;

  if (!mutation) return null;

  switch (mutation.kind) {
    case 'N':
      mutationBit = (
        <span>
          {
            formatPath(mutation) || formatSide(mutation.lhs)
          } = { formatSide(mutation.rhs) }
        </span>
      );
      break;
    case 'E':
      mutationBit = (
        <span>
          { formatPath(mutation) }&nbsp;
          (<span className='strike'>{ formatSide(mutation.lhs) }</span> = { formatSide(mutation.rhs) })
        </span>
      );
      break;
    case 'D':
      mutationBit = (
        <span className='strike'>{
          mutation.path ?
            formatPath(mutation) :
            formatSide(mutation.lhs)
        }</span>
      );
      break;
    case 'A':
      mutationBit = (
        <span>
          { formatPath(mutation) }
          { formatSingleMutation(mutation.item, indent + 1) }
        </span>
      );
      break;
  }

  return (
    <div style={{ marginLeft: (indent * 1.5) + 'em' }}>
      { getMutationIcon(mutation.kind) }
      { mutationBit }
    </div>
  );

  // return (
  //   <div style={{ marginLeft: (indent * 1.5) + 'em' }}>
  //     <div>
  //       { getMutationIcon(mutation.kind) }
  //       { formatPath(mutation) }
  //       { mutation.kind === 'A' && formatSingleMutation(mutation.item, indent + 1) }
  //     </div>
  //     <div style={{ marginLeft: '1.2em' }}>
  //       { isDefined(mutation.lhs) && formatSide(mutation.lhs) }
  //       { isDefined(mutation.rhs) && <span> <i className='fa fa-long-arrow-right'></i> { formatSide(mutation.rhs) }</span> }
  //     </div>
  //   </div>
  // );
}

export default function formatJSONMutation(mutations) {
  if (!mutations) return null;
  console.log(mutations);
  return (
    <div className='stateMutation'>
      <div className='diff'></div>
      {
        mutations.map((mutation, i) => <div key={i}>{ formatSingleMutation(mutation) }</div>)
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
