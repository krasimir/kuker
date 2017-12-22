// eslint-disable-next-line no-unused-vars
import PropTypes from 'prop-types';
import React from 'react';

import calculateRowStyles from './helpers/calculateRowStyles';
// eslint-disable-next-line no-unused-vars
import TimeDiff from '../../TimeDiff';
import readFromPath from '../../../helpers/readFromPath';
import shortenJSON from '../../../helpers/shortenJSON';

function getLabel(mobxEvent) {
  switch (mobxEvent.type) {
    case 'action':
      return (
        <span>
          <strong>action</strong>
          <span style={{ marginLeft: '0.2em' }}>{ readFromPath(mobxEvent, 'name') }</span>
        </span>
      );
    case 'transaction':
      return (
        <span>
          <strong>transaction</strong>
        </span>
      );
    case 'scheduled-reaction':
      return (
        <span>
          <strong>scheduled reaction</strong>
          <span style={{ marginLeft: '0.2em' }}>{ readFromPath(mobxEvent, 'object.name') }</span>
        </span>
      );
    case 'reaction':
      return (
        <span>
          <strong>reaction</strong>
          <span style={{ marginLeft: '0.2em' }}>{ readFromPath(mobxEvent, 'object.name') }</span>
        </span>
      );
    case 'compute':
      return (
        <span>
          <strong>compute</strong>
          <span style={{ marginLeft: '0.2em' }}>{ mobxEvent.object && shortenJSON(mobxEvent.object) }</span>
        </span>
      );
    case 'error':
      return (
        <span>
          <strong>error</strong>
          <span style={{ marginLeft: '0.2em' }}>{ readFromPath(mobxEvent, 'message') }</span>
        </span>
      );
    case 'update':
      return (
        <span>
          <strong>update</strong>
          <span style={{ marginLeft: '0.2em' }}>{ mobxEvent.object && shortenJSON(mobxEvent.object) }</span>
        </span>
      );
    case 'splice':
      return (
        <span>
          <strong>splice</strong>
          <span style={{ marginLeft: '0.2em' }}>{ mobxEvent.object && shortenJSON(mobxEvent.object) }</span>
        </span>
      );
    case 'add':
      return (
        <span>
          <strong>add</strong>
          <span style={{ marginLeft: '0.2em' }}>{ mobxEvent.object && shortenJSON(mobxEvent.object) }</span>
        </span>
      );
    case 'delete':
      return (
        <span>
          <strong>delete</strong>
          <span style={{ marginLeft: '0.2em' }}>{ mobxEvent.object && shortenJSON(mobxEvent.object) }</span>
        </span>
      );
    case 'create':
      return (
        <span>
          <strong>create</strong>
          <span style={{ marginLeft: '0.2em' }}>{ mobxEvent.object && shortenJSON(mobxEvent.object) }</span>
        </span>
      );
  }
  return mobxEvent.type || null;
}

export default function MobX({ event, onClick, className }) {
  const mobxEvent = event.event;
  const style = calculateRowStyles(event, { color: 'rgb(230, 230, 230)' });
  const iconStyles = {
    display: 'inline-block',
    marginLeft: `${ event.event.indent }em`,
    marginRight: '0.5em'
  };
  const label = getLabel(mobxEvent);

  return (
    <div style={ style } onClick={ onClick } className={ className }>
      <TimeDiff timeDiff={ event.timeDiff } parentStyle={ style } />
      <div className='actionRowContent'>
        { label === null ?
          <i className={ 'fa fa-stop-circle' } style={ iconStyles }></i> :
          <i className={ 'fa fa-angle-right' } style={ iconStyles }></i>
        }
        { label }
      </div>
    </div>
  );
};

MobX.propTypes = {
  event: PropTypes.object,
  onClick: PropTypes.func,
  className: PropTypes.string
};
