import React from 'react';
import PropTypes from 'prop-types';

export default class ExpandablePath extends React.Component {
  constructor(props) {
    super(props);

    this.state = { expanded: false };
    this._expand = this._expand.bind(this);
  }
  _expand() {
    this.setState({ expanded: true });
  }
  render() {
    const { full, short } = this.props;

    return <span>{ this.state.expanded ?
      full :
      <span><a onClick={ this._expand } style={{ display: 'inline ' }}>.....</a>{ short }</span>
    }</span>;
  }
};
ExpandablePath.propTypes = {
  full: PropTypes.string,
  short: PropTypes.string
};
