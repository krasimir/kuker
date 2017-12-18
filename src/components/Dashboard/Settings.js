import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'stent/lib/react';

class Settings extends React.Component {
  constructor(props) {
    super(props);

    const allAvailableTypes = this._extractTypes();

    if (props.types !== null) {
      Object.keys(allAvailableTypes).forEach(typeKey => {
        if (typeof props.types[typeKey] !== 'undefined') {
          allAvailableTypes[typeKey] = props.types[typeKey];
        }
      });
    }

    this.state = { types: allAvailableTypes };
  }
  _extractTypes() {
    return this.props.events.reduce((result, event) => {
      if (typeof event.type !== 'undefined') {
        result[event.type] = true;
      }
      return result;
    }, {});
  }
  _onChange(type) {
    const { types } = this.state;

    types[type] = !types[type];
    this.setState({ types });
    this.props.onChange({ [type]: types[type] });
  }
  _none() {
    const newTypes = Object.keys(this.state.types).reduce((result, type) => {
      result[type] = false;
      return result;
    }, {});

    this.setState({ types: newTypes });
    this.props.onChange(newTypes);
  }
  _all() {
    const newTypes = Object.keys(this.state.types).reduce((result, type) => {
      result[type] = true;
      return result;
    }, {});

    this.setState({ types: newTypes });
    this.props.onChange(newTypes);
  }
  _areAllUnselected() {
    return Object.keys(this.state.types).reduce((result, type) => {
      if (!result || this.state.types[type]) return false;
      return result;
    }, true);
  }
  _areAllSelected() {
    return Object.keys(this.state.types).reduce((result, type) => {
      if (!result || !this.state.types[type]) return false;
      return result;
    }, true);
  }
  render() {
    const { onClose } = this.props;
    const { types } = this.state;

    return (
      <div className='settings'>
        <a className='close' onClick={ onClose }><i className='fa fa-times'></i></a>
        <p><strong>Events:</strong></p>
        <div>
          { Object.keys(types).map((type, i) => {
            return (
              <label key={ i } className='block mb05'>
                <input type='checkbox' checked={ types[type] } onChange={ event => this._onChange(type) }/>
                { type }
              </label>
            );
          }) }
          <hr />
          <label key='none' className='block mb05'>
            <input type='checkbox' checked={ this._areAllUnselected() } onChange={ event => this._none() }/>
            None
          </label>
          <label key='all' className='block mb05'>
            <input type='checkbox' checked={ this._areAllSelected() } onChange={ event => this._all() }/>
            All
          </label>
        </div>
      </div>
    );
  }
}

Settings.propTypes = {
  types: PropTypes.object,
  events: PropTypes.array,
  onChange: PropTypes.func,
  onClose: PropTypes.func
};

export default connect(Settings)
  .with('DevTools')
  .map(devTools => ({
    events: devTools.state.events,
    onChange: devTools.updateFilterTypes,
    types: devTools.state.filterTypes
  }));
