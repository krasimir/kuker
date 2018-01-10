/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'stent/lib/react';
import renderJSON from '../../helpers/renderJSON';

function HTMLPin({ component }) {
  const { name, props, state, children, ...other } = component;

  return (
    <div className='HTMLPin'>
      <p><strong>&lt;{ name }&gt;</strong></p>
      { props && Object.keys(props).length > 0 && renderJSON(props, 'props') }
      { state && Object.keys(state).length > 0 && renderJSON(state, 'state') }
      { other && Object.keys(other).length > 0 && renderJSON(other, '...') }
    </div>
  );
};

HTMLPin.propTypes = {
  component: PropTypes.object
};

export default connect(HTMLPin)
  .with('Pinned')
  .map();
