import { Machine } from 'stent';

export function createRawMachine() {
  return Machine.create(
    { name: 'formatted' },
    {
      'formatted': {
        'view raw': 'raw'
      },
      'raw': {
        'view formatted': 'formatted'
      }
    }
  );
};
