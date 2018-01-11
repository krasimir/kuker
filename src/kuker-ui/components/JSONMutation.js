/* eslint-ignore max-len */
import React from 'react';
import PropTypes from 'prop-types';
import normalizeMutationPathParts from '../helpers/normalizeMutationPathParts';
import SingleMutation from './SingleMutation';

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

function normalizeMutations(mutations, filter) {
  var r, isThereAnyFilter = filter && filter !== '';

  if (isThereAnyFilter) {
    r = new RegExp(filter, 'i');
  }

  return normalizeMutationPathParts(
    mutations.map(mutation => ({ ...mutation, filterRegExp: isThereAnyFilter })),
    r
  );
}

export default function JSONMutation({ mutations, filter }) {
  if (!mutations) return null;

  return (
    <div className='stateMutation'>
      <div className='diff'></div>
      {
        normalizeMutations(mutations, filter)
          .map((mutation, i) => <div key={i}><SingleMutation mutation={ mutation } /></div>)
      }
    </div>
  );
};

JSONMutation.propTypes = {
  mutations: PropTypes.array,
  filter: PropTypes.string
};

export function extractMutatedPaths(mutation) {
  return mutation.map(({ path, item }) => {
    if (path) return path.join('.');
    if (item) return extractMutatedPaths([ item ]);
    return '';
  });
};
