// eslint-disable-next-line no-unused-vars
import PropTypes from 'prop-types';
import React from 'react';

export default function NewSession({ event }) {
  const origin = event.origin ? ` by ${ event.origin }` : '';
  const atServer = event.serverURL ? ` at ${ event.serverURL }` : '';

  return (
    <div className='newSession'>
      <i className='fa fa-sun-o'></i> New session initialized{ origin }{ atServer }
    </div>
  );
}

NewSession.propTypes = {
  event: PropTypes.object
};
