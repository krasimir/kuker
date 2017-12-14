// eslint-disable-next-line no-unused-vars
import React from 'react';

function getGradientValues(parentStyle) {
  const fallback = { g1: 'rgba(255, 255, 255, 0)', g2: 'rgba(255, 255, 255, 1)' };

  if (!parentStyle || !parentStyle.backgroundColor) {
    return fallback;
  }
  const toRGBAlpha = parentStyle.backgroundColor.replace('rgb(', 'rgba(');

  return {
    g1: toRGBAlpha.replace(')', ', 0)'),
    g2: toRGBAlpha.replace(')', ', 1)')
  };
}

export default function TimeDiff({ timeDiff, parentStyle }) {
  if (!timeDiff) return null;

  const { g1, g2 } = getGradientValues(parentStyle);
  const gradient = {
    background: `linear-gradient(to right, ${ g1 } 0%,${ g2 } 100%)`
  };

  return (
    <small className='timeDiff' style={{ backgroundColor: g2 }}>
      <i className='fa fa-clock-o' style={{ marginRight: '0.5em' }}></i>
      { timeDiff }
      <span className='gradient' style={ gradient }></span>
    </small>
  );
}
