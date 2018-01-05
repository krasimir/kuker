import React from 'react';
import PropTypes from 'prop-types';
import { PAGES } from '../constants';
import { connect } from 'stent/lib/react';
import Dashboard from './Dashboard';

class App extends React.Component {
  _renderPage() {
    const { page } = this.props;

    switch (page) {
      case PAGES.DASHBOARD: return <Dashboard />;
    }
    return <p>...</p>;
  }
  render() {
    return (
      <div style={{ height: '100%' }}>
        { this._renderPage() }
      </div>
    );
  }
};

export default connect(App)
  .with('DevTools')
  .map(({ state }) => ({ page: state.page }));

App.propTypes = {
  page: PropTypes.string
};
