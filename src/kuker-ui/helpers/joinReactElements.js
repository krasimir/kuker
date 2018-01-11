import React from 'react';

export default function joinReactElements(delimiter, arr) {
  return (
    <span>
      {
        arr.map((element, i) => {
          if (i < arr.length - 1) {
            return <span key={ i }>{ element }{ delimiter }</span>;
          }
          return <span key={ i }>{ element }</span>;
        })
      }
    </span>
  );
};
