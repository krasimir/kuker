// eslint-disable-next-line no-unused-vars
import PropTypes from 'prop-types';
import React from 'react';

export default function NewEmitter({ event }) {
  const origin = event.origin ? ` by ${ event.origin }` : '';
  const atServer = event.serverURL ? ` at ${ event.serverURL }` : '';
  const emitter = event.emitterDescription || event.emitterName || null;

  return (
    <div className='NewEmitter'>
      <i className='fa fa-sun-o'></i>
      <span> New emitter initialized { emitter ? `(${ emitter })` : ''}</span>
      <span>{ origin }{ atServer }</span>
    </div>
  );
}

NewEmitter.propTypes = {
  event: PropTypes.object
};
