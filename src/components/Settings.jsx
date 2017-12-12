import React from 'react';

export default class Settings extends React.Component {
  constructor(props) {
    super(props);

    const types = this._extractTypes();

    if (props.types !== null) {
      Object.keys(types).forEach(type => {
        types[type] = props.types.indexOf(type) >= 0;
      });
    }

    this.state = { types };
  }
  _extractTypes() {
    return this.props.events.reduce((result, event) => {
      if (typeof event.type !== 'undefined') {
        result[event.type] = true;
      } else if (typeof event.label !== 'undefined') {
        result[event.label] = true;
      }
      return result;
    }, {});
  }
  _onChange(type) {
    const { types } = this.state;

    types[type] = !types[type];
    this.setState({ types });
    this.props.onChange(Object.keys(types).filter(type => types[type]));
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
        </div>
      </div>
    );
  }
}
