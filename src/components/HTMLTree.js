/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'stent/lib/react';
import Tree from './Tree';

function formatPropValue(value) {
  try {
    const str = JSON.stringify(value);

    if (str.length > 20) {
      return str.substr(0, 20) + '...';
    }
    return str;
  } catch (error) {
    return '';
  }
}

class HTMLTree extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mouseOver: ''
    };
  }
  _onComponentClick(key) {
    this.setState({
      ...this.state,
      [key]: !this.state[key]
    });
  }
  _onComponentMouseOver(event, expandKey, component) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ mouseOver: expandKey, mouseOverComponent: component });
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
  
    return (
      <div
        style={ wrapperStyle }
        className={ 'tag' + (expandedKey === this.state.mouseOver ? ' over' : '') }
        onMouseOver={ event => this._onComponentMouseOver(event, expandedKey, component) }
      >
        <a onClick={ () => this._onComponentClick(expandedKey) }>
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
  _renderMouseOverComponent() {
    if (!this.state.mouseOverComponent) return null;

    const { name, props, state } = this.state.mouseOverComponent;
    
    const attributes = Object.keys(props)
      .map((attrName, i) => {
        return (
          <div key={ i }>
            <span className='attrName'>{ attrName }=</span>
            <span className='attrValue'>{ formatPropValue(props[attrName]) }</span>
          </div>
        );
      });

    return (
      <div className='mouseOverComponent'>
        &lt;{ name }<br />
        { attributes }
      </div>
    );
  }
  render() {
    const { pinnedEvent } = this.props;

    return (
      <div className='HTMLTree'>
        { pinnedEvent && this._renderTag(pinnedEvent.state) }
        { this._renderMouseOverComponent() }
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
