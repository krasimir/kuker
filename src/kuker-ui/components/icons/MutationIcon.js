import React from 'react';
import PropTypes from 'prop-types';

export default function MutationIcon({ kind }) {
  switch (kind) {
    case 'N': return <i className={ 'fa fa-plus-square ' + kind }></i>;
    case 'D': return <i className={ 'fa fa-minus-square ' + kind }></i>;
    case 'E': return <i className={ 'fa fa-pencil ' + kind }></i>;
    case 'A': return <i className={ 'fa fa-pencil ' + kind }></i>;
  }
  return null;
};

MutationIcon.propTypes = {
  kind: PropTypes.string
};
