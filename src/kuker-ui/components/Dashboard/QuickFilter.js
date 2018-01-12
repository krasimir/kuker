import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'stent/lib/react';

class QuickFilter extends React.Component {
  constructor(props) {
    super(props);

    this._onFieldChange = this._onFieldChange.bind(this);
    this._clearFilter = this._clearFilter.bind(this);
    this.state = { text: props.quickFilters[props.whichOne] };
  }
  _onFieldChange(e) {
    const { whichOne, updateQuickFilters } = this.props;
    const text = e.target.value;

    updateQuickFilters(whichOne, text);
    this.setState({ text });
  }
  _clearFilter() {
    this.setState({ text: '' }, () => {
      this.props.updateQuickFilters(this.props.whichOne, '');
    });
  }
  render() {
    return (
      <div className='filter'>
        <i className='fa fa-filter'></i>
        <input type='text' placeholder='filter' onChange={ this._onFieldChange } value={ this.state.text }/>
        { this.state.text !== '' && <a className='filterClear' onClick={ this._clearFilter }>
          <i className='fa fa-times'></i> clear</a> }
      </div>
    );
  }
};

QuickFilter.propTypes = {
  whichOne: PropTypes.string,
  updateQuickFilters: PropTypes.func,
  quickFilters: PropTypes.object
};

export default connect(QuickFilter).with('DevTools').map(
  ({ state, updateQuickFilters }) => ({
    updateQuickFilters,
    quickFilters: state.quickFilters
  })
);
