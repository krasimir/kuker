import { Machine } from 'stent';

const TreeNav = Machine.create('TreeNav', {
  state: { name: 'state' },
  transitions: {
    'state': {
      'view event': 'event',
      'view analysis': 'analysis'
    },
    'event': {
      'view state': 'state',
      'view analysis': 'analysis'
    },
    'analysis': {
      'view state': 'state',
      'view event': 'event'
    }
  }
});

export default TreeNav;
