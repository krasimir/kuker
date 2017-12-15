/* eslint-disable no-unused-vars */
import getMachineName from './getMachineName';
import renderJSON from './renderJSON';

export function renderMachinesAsTree(machines = [], onItemClick = null) {
  var unnamed = 1;

  return renderJSON(machines.reduce((tree, machine) => {
    var machineName = getMachineName(machine);

    if (machineName === '<unnamed>') machineName = `<unnamed(${ ++unnamed })>`;
    tree[machineName] = machine.state;
    return tree;
  }, {}), 'Machines', onItemClick);
};

export function renderStateAsTree(state = {}, onItemClick = null) {
  return renderJSON(state, 'State', onItemClick);
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
