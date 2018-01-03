import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'stent/lib/react';

function QuickFilter({ whichOne, updateQuickFilters }) {
  const handler = e => {
    updateQuickFilters(whichOne, e.target.value);
  };

  return (
    <div className='filter'>
      <i className='fa fa-filter'></i>
      <input type='text' placeholder='filter' onChange={ handler }/>
    </div>
  );
};

QuickFilter.propTypes = {
  whichOne: PropTypes.string,
  updateQuickFilters: PropTypes.func
};

export default connect(QuickFilter).with('DevTools').map(
  ({ state, updateQuickFilters }) => ({
    updateQuickFilters
  })
);
