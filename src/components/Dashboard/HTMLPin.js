import React from 'react';
import PropTypes from 'prop-types';
import formatPropValue from '../../helpers/formatPropValue';
import { connect } from 'stent/lib/react';

function formatKeyValueData(label, data) {
  const formatted = Object.keys(data || {})
    .map((key, i) => {
      return (
        <div key={ i }>
          <span className='attrName'>{ key }=</span>
          <span className='attrValue'>{ formatPropValue(data[key], 50) }</span>
        </div>
      );
    });

  if (formatted.length === 0) {
    return null;
  }

  return (
    <div style={{ marginLeft: '0.5em' }}>
      <i className='fa fa-angle-right'></i> { label }
      <div style={{ marginLeft: '0.5em' }}>{ formatted }</div>
    </div>
  );
}

function HTMLPin({ component }) {

  const { name, props, state } = component;

  return (
    <div className='HTMLPin'>
      <p><strong>&lt;{ name }&gt;</strong></p>
      { formatKeyValueData('attributes:', props) }
      { formatKeyValueData('state:', state) }
    </div>
  );
};

HTMLPin.propTypes = {
  component: PropTypes.object
};

export default connect(HTMLPin)
  .with('Pinned')
  .map();
