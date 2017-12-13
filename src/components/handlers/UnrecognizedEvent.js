// eslint-disable-next-line no-unused-vars
import React from 'react';

import calculateRowStyles from './helpers/calculateRowStyles';
// eslint-disable-next-line no-unused-vars
import TimeDiff from '../TimeDiff.jsx';

export default function UnrecognizedEvent({ event, onClick, className }) {
  const icon = event.icon || 'fa-angle-double-right';
  const label = event.label && event.label.replace(/ /g, '') !== event.type ?
    <span style={{ marginLeft: '0.6em' }}>{ event.label }</span> : '';
  const style = calculateRowStyles(event, { color: 'rgb(230, 230, 230)' });

  return (
    <li style={ style } onClick={ onClick } className={ className }>
      <TimeDiff timeDiff={ event.timeDiff } parentStyle={ style } />
      <div className='actionRowContent'>
        <i className={ 'fa ' + icon } style={{ marginRight: '0.5em' }}></i>
        <strong>{ event.type }</strong>
        { label }
      </div>
    </li>
  );
};
