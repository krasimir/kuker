// eslint-disable-next-line no-unused-vars
import PropTypes from 'prop-types';
import React from 'react';

export default function NewSession({ event }) {
  return (
    <li className='newSession'>
      new session initialized { event.origin ? `by ${ event.origin }` : ''}
    </li>
  );
}

NewSession.propTypes = {
  event: PropTypes.object
};
