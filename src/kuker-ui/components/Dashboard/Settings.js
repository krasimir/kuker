import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'stent/lib/react';

class Settings extends React.Component {
  constructor(props) {
    super(props);

    const allAvailableTypes = this._extractTypes();
    const allAvailableSources = this._extractSources();

    if (props.types !== null) {
      Object.keys(allAvailableTypes).forEach(typeKey => {
        if (typeof props.types[typeKey] !== 'undefined') {
          allAvailableTypes[typeKey] = props.types[typeKey];
        }
      });
    }
    if (props.sources !== null) {
      Object.keys(allAvailableSources).forEach(sourceKey => {
        if (typeof props.sources[sourceKey] !== 'undefined') {
          allAvailableSources[sourceKey] = props.sources[sourceKey];
        }
      });
    }

    this.state = {
      types: allAvailableTypes,
      sources: allAvailableSources
    };
  }
  _extractTypes() {
    return this.props.events.reduce((result, event) => {
      if (typeof event.type !== 'undefined') {
        result[event.type] = true;
      }
      return result;
    }, {});
  }
  _extractSources() {
    return this.props.events.reduce((result, event) => {
      if (typeof event.origin !== 'undefined') {
        result[event.origin] = true;
      }
      return result;
    }, {});
  }
  _onChangeTypes(type) {
    const { types } = this.state;

    types[type] = !types[type];
    this.setState({ types });
    this.props.onChange({ filterTypes: { [type]: types[type] } });
  }
  _onChangeSource(source) {
    const { sources } = this.state;

    sources[source] = !sources[source];
    this.setState({ sources });
    this.props.onChange({ sources: { [source]: sources[source] } });
  }
  _none() {
    const newTypes = Object.keys(this.state.types).reduce((result, type) => {
      result[type] = false;
      return result;
    }, {});

    this.setState({ types: newTypes });
    this.props.onChange({ filterTypes: newTypes });
  }
  _all() {
    const newTypes = Object.keys(this.state.types).reduce((result, type) => {
      result[type] = true;
      return result;
    }, {});

    this.setState({ types: newTypes });
    this.props.onChange({ filterTypes: newTypes });
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
    const { types, sources } = this.state;

    return (
      <div className='settings'>
        <a className='close' onClick={ onClose }><i className='fa fa-times'></i></a>
        <div className='events'>
          <p><strong>Events:</strong></p>
          { Object.keys(types).map((type, i) => {
            return (
              <label key={ 'type' + i } className='block mb05'>
                <input type='checkbox' checked={ types[type] } onChange={ event => this._onChangeTypes(type) }/>
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
        <div className='sources'>
          <p><strong>Sources:</strong></p>
          { Object.keys(sources).map((source, i) => {
            return (
              <label key={ 'source' + i } className='block mb05'>
                <input type='checkbox' checked={ sources[source] } onChange={ event => this._onChangeSource(source) }/>
                { source }
              </label>
            );
          }) }
        </div>
      </div>
    );
  }
}

Settings.propTypes = {
  types: PropTypes.object,
  sources: PropTypes.object,
  events: PropTypes.array,
  onChange: PropTypes.func,
  onClose: PropTypes.func
};

export default connect(Settings)
  .with('DevTools')
  .map(devTools => ({
    events: devTools.state.events,
    onChange: devTools.updateFilters,
    types: devTools.state.filterTypes,
    sources: devTools.state.sources
  }));
