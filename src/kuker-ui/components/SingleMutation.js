import React from 'react';
import PropTypes from 'prop-types';
import formatMutationPath from '../helpers/formatMutationPath';
import formatSide from '../helpers/formatSide';
import MutationIcon from './icons/MutationIcon';

export default function SingleMutation({ mutation, indent }) {
  var mutationBit;

  if (!mutation) return null;

  switch (mutation.kind) {
    case 'N':
      const left = formatMutationPath(mutation) || formatSide(mutation.lhs) || null;
      const right = formatSide(mutation.rhs);

      mutationBit = (
        <span>
          { left }
          { left && right && ' = ' }
          { formatSide(mutation.rhs) }
        </span>
      );
      break;
    case 'E':
      mutationBit = (
        <span>
          { formatMutationPath(mutation) }&nbsp;
          (<span className='strike'>{ formatSide(mutation.lhs) }</span> <i className='fa fa-long-arrow-right'></i> { formatSide(mutation.rhs) })
        </span>
      );
      break;
    case 'D':
      mutationBit = (
        <span className='strike'>{
          mutation.path ?
            formatMutationPath(mutation) :
            formatSide(mutation.lhs)
        }</span>
      );
      break;
    case 'A':
      mutationBit = (
        <span>
          { formatMutationPath(mutation) }
          <SingleMutation mutation={ mutation.item } indent={ indent + 1 } />
        </span>
      );
      break;
  }

  return (
    <div style={{ marginLeft: (indent * 1.5) + 'em' }}>
      <MutationIcon kind={ mutation.kind } />
      { mutationBit }
    </div>
  );
};

SingleMutation.defaultProps = {
  indent: 0
};

SingleMutation.propTypes = {
  mutation: PropTypes.object,
  indent: PropTypes.number
};
