/* eslint-disable no-unused-vars */
import getMachineName from './getMachineName';
import renderJSON from './renderJSON';
import React from 'react';

export function renderStateAsTree(state = {}, onItemClick = null, mutationExplorerPath = null) {
  return renderJSON(state, <i className='fa fa-list-alt'></i>, onItemClick, mutationExplorerPath);
};

export function renderEventAsTree(event, onItemClick = null) {
  const {
    state,
    origin,
    id,
    icon,
    withMarker,
    color,
    ...rest
  } = event || {};

  return renderJSON({ ...rest }, 'Event', onItemClick);
};
