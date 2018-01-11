import React from 'react';
import rjoin from './joinReactElements';

export default function normalizeMutationPathParts(mutations, filterRegExp) {
  return mutations
    .filter(mutation => {
      if (!mutation.path || !filterRegExp) return true;
      return mutation.path.find((part, index) => {
        const match = part.toString().match(filterRegExp);

        if (match) {
          let tokens = part.split(filterRegExp);

          tokens = tokens.reduce((soFar, token, i) => {
            if (i > 0) soFar.push(<strong style={{ color: 'red' }}>{ match[0] }</strong>);
            soFar.push(token);
            return soFar;
          }, []);

          mutation.newPath = [rjoin('', tokens)].concat(mutation.path.slice(index + 1));
          return true;
        };
        return false;
      });
    })
    .map(mutation => {
      if (mutation.newPath) {
        mutation.path = mutation.newPath;
        delete mutation.newPath;
      }
      return mutation;
    });
};
