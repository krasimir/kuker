import React from 'react';
import PropTypes from 'prop-types';
import Tree from '../Tree';

export default function Event({ event }) {
  return <Tree data={ event } />;
};

Event.propTypes = {
  event: PropTypes.object
};
