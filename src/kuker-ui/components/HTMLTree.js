/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'stent/lib/react';
import formatPropValue from '../helpers/formatPropValue';
import HTMLMutation from './HTMLMutation';

const TEXT_NODE = 3;
const COMMENT_NODE = 8;
var HTMLTreeState = { mouseOver: '' };
var filteredTreesCache = {};

const extractFilteredTrees = function (root, filter, result = []) {
  if (root.name && root.name.match(filter)) {
    result.push(root);
  }
  if (root.children && root.children.length > 0) {
    result = root.children.reduce((soFar, child) => {
      soFar = soFar.concat(extractFilteredTrees(child, filter));
      return soFar;
    }, result);
  }
  return result;
};
const wrapperStyle = {
  marginLeft: '8px'
};
const nodeStyles = {
  [TEXT_NODE]: {
    ...wrapperStyle,
    color: 'rgb(220, 107, 21)',
    fontSize: '0.9em',
    fontWeight: 'bold'
  },
  [COMMENT_NODE]: {
    ...wrapperStyle,
    color: 'rgb(84, 84, 84)',
    fontSize: '0.9em'
  }
};

class HTMLTree extends React.Component {
  constructor(props) {
    super(props);

    this.state = HTMLTreeState;
  }
  _onComponentClick(key, component) {
    this.setState(HTMLTreeState = {
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
  _showMutation(mutationExplorerPath) {
    if (mutationExplorerPath === this.state.mutationExplorerPath) {
      this.props.clearMutation();
      this.setState({ mutationExplorerPath: null });
    } else {
      this.props.showMutation(mutationExplorerPath);
      this.setState({ mutationExplorerPath });
    }
  }
  _renderTag(component, indent = 0, jsonPath = '') {
    if ([TEXT_NODE, COMMENT_NODE].indexOf(component.nodeType) >= 0 && component.nodeValue) {
      if (component.nodeValue.replace(/^\s*\n\s+/gm, '') !== '') {
        return (
          <div style={ nodeStyles[component.nodeType] }>
            { component.nodeType === COMMENT_NODE ? '/* ' : '"' }
            { component.nodeValue }
            { component.nodeType === COMMENT_NODE ? ' */' : '"' }
          </div>
        );
      }
      return null;
    }

    const name = component.name;
    const props = component.props || {};
    const children = component.children;
    const expandedKey = jsonPath;
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

    if (this.state.htmlPin && expandedKey === this.state.htmlPin.key) {
      // eslint-disable-next-line
      this.state.htmlPin.component = component;
    }

    return (
      <div
        style={ wrapperStyle }
        className={
          'tag' +
          (expandedKey === this.state.mouseOver ? ' over' : '') +
          (this.state.mutationExplorerPath === jsonPath ? ' mutationExplorer' : '')
        }
        onMouseOver={ event => this._onComponentMouseOver(event, expandedKey, component) }
      >
        <a onClick={ () => this._onComponentClick(expandedKey, component) }>
          &lt;
          <strong>{ name }</strong>{ attributes.length > 0 && <span> { attributes }</span> }
          { hasChildren ? <span>&gt;</span> : <span>/&gt;</span> }
          { !renderChildren && hasChildren && <span>...&lt;/<strong>{ name }</strong>&gt;</span>}
        </a><a onClick={ () => this._showMutation(jsonPath) }><i className='fa fa-eye viewMutationIcon'></i></a>
        { renderChildren && hasChildren && children.map((child, i) => {
          return (
            <div key={ i }>{
              this._renderTag(
                children[i],
                indent + 1, `${ jsonPath !== '' ? jsonPath + '.' : jsonPath }children.${ i }`
              )
            }</div>
          );
        }) }
        { renderChildren && hasChildren && <span>&lt;/<strong>{ name }</strong>&gt;</span>}
      </div>
    );
  };
  render() {
    const { pinnedEvent, filter, Pin } = this.props;
    var trees = [];

    if (pinnedEvent) {
      if (filter !== '') {
        const cacheId = filter + pinnedEvent.id;

        if (!filteredTreesCache[cacheId]) {
          filteredTreesCache = {
            [cacheId]: extractFilteredTrees(pinnedEvent.state, new RegExp(`^${ filter }`, 'ig'))
          };
        }
        trees = filteredTreesCache[cacheId];
      } else {
        trees = [ pinnedEvent.state ];
      }
    }

    return (
      <div className={ 'logRightContentWrapper' + (this.state.htmlPin ? ' withDetails' : '') }>
        <div className='logTree HTMLTree'>
          {
            trees.map((tree, i) =>
              <div key={ i } className='filteredTreeResult'>{ this._renderTag(tree, 0) }</div>)
          }
          <HTMLMutation pinnedEvent={ pinnedEvent } filter={ filter } />
        </div>
        <div className='logDetails'>
          { trees.length > 0 && this.state.htmlPin && <Pin component={ this.state.htmlPin.component } /> }
        </div>
      </div>
    );
  }
};

HTMLTree.propTypes = {
  pinnedEvent: PropTypes.object,
  showMutation: PropTypes.func,
  clearMutation: PropTypes.func,
  filter: PropTypes.string,
  Pin: PropTypes.any
};

export default connect(HTMLTree)
  .with('Pinned', 'DevTools')
  .map(({ state }, devtools) => ({
    showMutation: devtools.showMutation,
    clearMutation: devtools.clearMutation,
    pinnedEvent: state.pinnedEvent,
    filter: devtools.state.quickFilters.right
  }));
