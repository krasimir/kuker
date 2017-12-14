import React from 'react';
import PropTypes from 'prop-types';
import Tree from '../Tree';
import { StentHandlers } from './Handlers';
import { renderMachinesAsTree } from '../../helpers/renderAsTree';

export default function State({ event }) {
  const renderer = event && event.type in StentHandlers ? renderMachinesAsTree : null;

  return <Tree data={ event.state } renderer={ renderer }/>;
}

State.propTypes = {
  event: PropTypes.object
};
