// eslint-disable-next-line no-unused-vars
import React from 'react';
// eslint-disable-next-line no-unused-vars
import getMachineName from '../../../helpers/getMachineName';
import shortenJSON from '../../../helpers/shortenJSON';

import calculateRowStyles from './helpers/calculateRowStyles';
// eslint-disable-next-line no-unused-vars
import TimeDiff from '../../TimeDiff';

export default function onGeneratorStep({ event, onClick, className }) {
  const { yielded, timeDiff } = event;
  var message = '';
  const style = calculateRowStyles(event, { color: 'rgb(201, 202, 189)' });

  if (typeof yielded === 'string') {
    message = <span>generator yielded <strong>&#123; name: { yielded } }</strong></span>;
  } else if (typeof yielded === 'object') {
    if (yielded.__type === 'call') {
      const argsText = yielded.args.length === 0 ? 'with no arguments' : `with ${ shortenJSON(yielded.args) }`;

      message = <span>calling <strong>{ yielded.func }</strong> { argsText }</span>;
    } else if (yielded.name) {
      message = <span>generator yielded <strong>&#123; name: { yielded.name }, ...}</strong></span>;
    }
  }
  return (
    <li style={ style } onClick={ onClick } className={ className }>
      <TimeDiff timeDiff={ timeDiff } parentStyle={ style } />
      <div className='actionRowContent'>
        <i className='fa fa-arrow-circle-left'></i>
        { message }
      </div>
    </li>
  );
};
