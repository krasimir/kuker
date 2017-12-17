import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'stent/lib/react';
import NoEvents from './NoEvents';
import Settings from './Settings';
import { AutoSizer, List } from 'react-virtualized';
import EventListRow from './EventListRow';
import Event from './Event';
import State from './State';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this._rowRenderer = this._rowRenderer.bind(this);
    this.state = {
      filterByTypes: null,
      settingsVisibility: false
    };
  }
  _changeSettingsVisibility(eventsToRender) {
    this.setState({ settingsVisibility: !this.state.settingsVisibility });
    if (eventsToRender.length > 0) {
      this.props.pin(eventsToRender[eventsToRender.length - 1].id);
    }
  }
  _rowRenderer(eventsToRender, { index, isScrolling, isVisible, key, parent, style }) {
    const { pinnedEvent, pin } = this.props;

    return (
      <div key={ key } style={style} >
        <EventListRow
          event={ eventsToRender[index] }
          pinnedEvent={ pinnedEvent }
          pin={ pin }
        />
      </div>
    );
  }
  render() {
    const { filterByTypes } = this.state;
    const {
      clear,
      marker,
      navViewState,
      navViewEvent,
      navViewAnalysis,
      navState,
      events,
      pinnedEvent,
      mutationExplorerPath,
      clearMutation
    } = this.props;

    if (events.length === 0) {
      return <NoEvents />;
    }

    const eventsToRender = events.filter(({ type }) => {
      // filter by type
      if (filterByTypes !== null && (type && filterByTypes.indexOf(type) < 0)) {
        return false;
      }
      return true;
    });

    return (
      <div className='dashboard'>
        <div className='logLeft'>
          <div className='logNav'>
            <a onClick={ () => marker() } key='marker' className='ml05 mr1 try2'>
              <i className='fa fa-bookmark'></i>
            </a>
            <a onClick={ () => clear() } key='clear' className='mr1 try2'>
              <i className='fa fa-ban'></i>
            </a>
            <a onClick={ () => this._changeSettingsVisibility(eventsToRender) }
              key='s'
              className='right mr05 try2'>
              <i className='fa fa-gear'></i>
            </a>
          </div>
          <ul className='log'>
            { /* events.map(this._renderEvent) */ }
            <AutoSizer>
              {({ height, width }) => (
                <List
                  ref={ l => (this.list = l) }
                  rowRenderer={ (...args) => this._rowRenderer(eventsToRender, ...args) }
                  height={ height }
                  rowCount={ eventsToRender.length }
                  rowHeight={ 28 }
                  width={ width }
                  scrollToIndex={ !pinnedEvent ? -1 : eventsToRender.findIndex(e => e.id === pinnedEvent.id) }/>
              )}
            </AutoSizer>
          </ul>
          { this.state.settingsVisibility && (
            <Settings
              onClose={ () => this._changeSettingsVisibility(eventsToRender) }
              onChange={ types => this.setState({ filterByTypes: types }) }
              events={ events }
              types={ this.state.filterByTypes } />
          ) }
        </div>
        <div className='logRight'>
          <div className='relative'>
            <div className='logNav fullHeight' key='nav'>
              <a onClick={ navViewState } className={ navState === 'state' ? 'selected' : null }>
                <i className='fa fa-heart mr05'></i>State</a>
              <a onClick={ navViewEvent } className={ navState === 'event' ? 'selected' : null }>
                <i className='fa fa-dot-circle-o mr05'></i>Event</a>
              <a onClick={ navViewAnalysis } className={ navState === 'analysis' ? 'selected' : null }>
                <i className='fa fa-bar-chart-o mr05'></i>Analysis</a>
            </div>
            <div className='logTree' key='content'>
              { navState === 'state' ? <State event={ pinnedEvent } /> : null }
              { navState === 'event' ? <Event event={ pinnedEvent } /> : null }
              { navState === 'analysis' ? 'Work in progress ...' : null }
            </div>
            { mutationExplorerPath !== null && <div className='mutationContainer'>
              <a onClick={ clearMutation }>
                <i className='fa fa-times'></i> { mutationExplorerPath }.* <i className='fa fa-eye'></i>
              </a>
            </div> }
          </div>
        </div>
      </div>
    );
  }
};

Dashboard.propTypes = {
  pin: PropTypes.func,
  clear: PropTypes.func,
  marker: PropTypes.func,
  pinnedEvent: PropTypes.object,
  events: PropTypes.array,
  navViewState: PropTypes.func,
  navViewEvent: PropTypes.func,
  navViewAnalysis: PropTypes.func,
  clearMutation: PropTypes.func,
  navState: PropTypes.string,
  mutationExplorerPath: PropTypes.string,
  healthy: PropTypes.bool
};

export default connect(
  connect(Dashboard)
    .with('DevTools')
    .map(({ state, flushEvents, addMarker, pin, mutationExplorerPath, clearMutation }) => {
      return {
        clear: () => flushEvents(),
        marker: () => addMarker(),
        pin: id => pin(id),
        pinnedEvent: state.pinnedEvent,
        events: state.events,
        mutationExplorerPath: state.mutationExplorerPath,
        clearMutation
      };
    })
).with('TreeNav').map(n => {
  return {
    navViewState: n.viewState,
    navViewEvent: n.viewEvent,
    navViewAnalysis: n.viewAnalysis,
    navState: n.state.name
  };
});
