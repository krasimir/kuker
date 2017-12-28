/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'stent/lib/react';
import formatPropValue from '../helpers/formatPropValue';
import HTMLPin from './Dashboard/HTMLPin';

class HTMLTree extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mouseOver: ''
    };
  }
  _onComponentClick(key, component) {
    this.setState({
      ...this.state,
      [key]: !this.state[key],
      htmlPin: { key, component }
    });
  }
  _onComponentMouseOver(event, expandKey, component) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ mouseOver: expandKey });
  }
  _renderTag(component, indent = 0, index = 1) {
    const { name, props, children } = component;
    const expandedKey = index.toString();
    const renderChildren = this.state[expandedKey];
    const numOfProps = Object.keys(props).length;
    const hasChildren = children && children.length > 0;
    const attributes = Object.keys(props)
      .map((attrName, i) => {
        const style = {
          marginLeft: numOfProps > 3 ? '1em' : 0,
          display: numOfProps > 3 ? 'block' : 'inline'
        };

        return (
          <span key={ i } style={ style }>
            <span className='attrName'>{ attrName }=</span>
            <span className='attrValue'>{ formatPropValue(props[attrName]) }</span>
            { i < numOfProps - 1 && <span> </span>}
          </span>
        );
      });
    const wrapperStyle = {
      marginLeft: `${ indent * 3 }px`
    };

    if (this.state.htmlPin && expandedKey === this.state.htmlPin.key) {
      // eslint-disable-next-line
      this.state.htmlPin.component = component;
    }

    return (
      <div
        style={ wrapperStyle }
        className={ 'tag' + (expandedKey === this.state.mouseOver ? ' over' : '') }
        onMouseOver={ event => this._onComponentMouseOver(event, expandedKey, component) }
      >
        <a onClick={ () => this._onComponentClick(expandedKey, component) }>
          &lt;
          <strong>{ name }</strong>{ attributes.length > 0 && <span> { attributes }</span> }
          { hasChildren ? <span>&gt;</span> : <span>/&gt;</span> }
          { !renderChildren && hasChildren && <span>...&lt;/<strong>{ name }</strong>&gt; </span>}
        </a>
        { renderChildren && hasChildren && children.map((child, i) => {
          return (
            <div key={ i }>{ this._renderTag(children[i], indent + 1, expandedKey + (i + 1)) }</div>
          );
        }) }
        { renderChildren && hasChildren && <span>&lt;/<strong>{ name }</strong>&gt; </span>}
      </div>
    );
  };
  render() {
    const { pinnedEvent } = this.props;

    return (
      <div className={ 'logRightContentWrapper' + (this.state.htmlPin ? ' withDetails' : '') }>
        <div className='logTree HTMLTree'>
          { pinnedEvent && this._renderTag(pinnedEvent.state) }
        </div>
        <div className='logDetails'>
          { this.state.htmlPin && <HTMLPin component={ this.state.htmlPin.component } /> }
        </div>
      </div>
    );
  }
};

HTMLTree.propTypes = {
  pinnedEvent: PropTypes.object
};

export default connect(HTMLTree)
  .with('Pinned')
  .map(({ state }) => ({
    pinnedEvent: state.pinnedEvent
  }));
