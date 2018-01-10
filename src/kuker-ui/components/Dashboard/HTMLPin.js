/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'stent/lib/react';
import renderJSON from '../../helpers/renderJSON';

function HTMLPin({ component }) {
  const { name, children, ...other } = component;

  return (
    <div className='HTMLPin'>
      { other && Object.keys(other).length > 0 && renderJSON(other, <strong>&lt;{ name }&gt;</strong>) }
    </div>
  );
};

HTMLPin.propTypes = {
  component: PropTypes.object
};

export default connect(HTMLPin)
  .with('Pinned')
  .map();
