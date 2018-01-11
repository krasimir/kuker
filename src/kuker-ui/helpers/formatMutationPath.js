import React from 'react';
import ExpandablePath from './ExpandablePath';
import rjoin from './joinReactElements';

export default function formatPath(mutation) {
  const index = mutation.kind === 'A' ? `.${ mutation.index }` : null;
  const path = mutation.path;
  const filterRegExp = mutation.filterRegExp;

  if (path) {
    const full = path;
    const short = path.slice(path.length - 4, path.length);

    return path.length > 4 && !filterRegExp ?
      <span>
        <ExpandablePath full={ rjoin('.', full) } short={ rjoin('.', short) }/>{ index }
      </span> :
      <span>{ rjoin('.', full) }{ index }</span>;
  } else if (mutation.kind === 'A') {
    return <strong>{ index }</strong>;
  }
  return null;
};
