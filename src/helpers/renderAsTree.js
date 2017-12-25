/* eslint-disable no-unused-vars */
import getMachineName from './getMachineName';
import renderJSON from './renderJSON';
import React from 'react';

export function renderMachinesAsTree(machines = [], onItemClick = null) {
  // var unnamed = 1;
  return renderJSON(machines, 'Machines', onItemClick);
  // return renderJSON(machines.reduce((tree, machine) => {
  //   var machineName = getMachineName(machine);

  //   if (machineName === '<unnamed>') machineName = `<unnamed(${ ++unnamed })>`;
  //   tree[machineName] = machine.state;
  //   return tree;
  // }, {}), 'Machines', onItemClick);
};

export function renderStateAsTree(state = {}, onItemClick = null) {
  return renderJSON(state, <i className='fa fa-list-alt'></i>, onItemClick);
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
