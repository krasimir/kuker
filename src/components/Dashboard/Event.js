/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import Tree from '../Tree';

export default function Event({ event }) {
  const {
    kuker,
    id,
    time,
    stateMutation,
    mutationPaths,
    ...rest
  } = event;

  return <Tree data={ rest } />;
};

Event.propTypes = {
  event: PropTypes.object
};
