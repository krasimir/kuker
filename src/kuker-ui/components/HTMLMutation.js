/* eslint-ignore max-len */
import React from 'react';
import PropTypes from 'prop-types';
import renderJSONPreview from '../helpers/renderJSONPreview';
import ExpandablePath from '../helpers/ExpandablePath';

/*
kind - indicates the kind of change; will be one of the following:
  N - indicates a newly added property/element
  D - indicates a property/element was deleted
  E - indicates a property/element was edited
  A - indicates a change occurred within an array
path - the property path (from the left-hand-side root)
lhs - the value on the left-hand-side of the comparison (undefined if kind === 'N')
rhs - the value on the right-hand-side of the comparison (undefined if kind === 'D')
index - when kind === 'A', indicates the array index where the change occurred
item - when kind === 'A', contains a nested change record indicating the change that occurred at the array index
*/

function joinReact(delimiter, arr) {
  return (
    <span>
      {
        arr.map((element, i) => {
          if (i < arr.length - 1) {
            return <span key={ i }>{ element }{ delimiter }</span>;
          }
          return <span key={ i }>{ element }</span>;
        })
      }
    </span>
  );
}
function isDefined(value) {
  return typeof value !== 'undefined';
}
function getMutationIcon(kind) {
  switch (kind) {
    case 'N': return <i className={ 'fa fa-plus-square ' + kind }></i>;
    case 'D': return <i className={ 'fa fa-minus-square ' + kind }></i>;
    case 'E': return <i className={ 'fa fa-pencil ' + kind }></i>;
    case 'A': return <i className={ 'fa fa-pencil ' + kind }></i>;
  }
  return '';
}
function convertPathPartsToItems(path, tree) {
  const arr = [];
  var cursor = tree;

  for (let i = 0; i < path.length; i++) {
    const part = path[i];
    let item, childrenIndex = null;

    if (part === 'children') {
      item = cursor[part][path[i + 1]];
      if (item && Array.isArray(cursor[part]) && cursor[part].length > 1) {
        childrenIndex = path[i + 1];
      }
      i++;
    } else {
      item = cursor[part];
    }
    if (item) {
      cursor = item;
      arr.push(item.name ?
        childrenIndex !== null ? `<${ item.name }.${ childrenIndex }>` : `<${ item.name }>` :
        part
      );
    } else {
      arr.push(part);
    }
  }
  return arr;
}
function formatSide(side) {
  if (typeof side === 'object' && side !== null) {
    return renderJSONPreview(side);
  } else if (!isDefined(side)) {
    return null;
  }
  return String(side);
}
function formatPath(mutation) {
  const index = mutation.kind === 'A' ? `.${ mutation.index }` : null;
  const path = mutation.path;
  const filterRegExp = mutation.filterRegExp;

  if (path) {
    const full = path;
    const short = path.slice(path.length - 4, path.length);

    return path.length > 4 && !filterRegExp ?
      <span><ExpandablePath full={ joinReact('.', full) } short={ joinReact('.', short) }/>{ index }</span> :
      <span>{ joinReact('.', full) }{ index }</span>;
  } else if (mutation.kind === 'A') {
    return <strong>{ index }</strong>;
  }
  return null;
}
function formatSingleMutation(mutation, indent) {
  var mutationBit;

  if (!mutation) return null;

  switch (mutation.kind) {
    case 'N':
      const left = formatPath(mutation) || formatSide(mutation.lhs) || null;
      const right = formatSide(mutation.rhs);

      mutationBit = (
        <span>
          { left }
          { left && right && ' = ' }
          { formatSide(mutation.rhs) }
        </span>
      );
      break;
    case 'E':
      mutationBit = (
        <span>
          { formatPath(mutation) }&nbsp;
          (<span className='strike'>{ formatSide(mutation.lhs) }</span> <i className='fa fa-long-arrow-right'></i> { formatSide(mutation.rhs) })
        </span>
      );
      break;
    case 'D':
      mutationBit = (
        <span className='strike'>{
          mutation.path ?
            formatPath(mutation) :
            formatSide(mutation.lhs)
        }</span>
      );
      break;
    case 'A':
      mutationBit = (
        <span>
          { formatPath(mutation) }
          { formatSingleMutation(mutation.item, indent + 1) }
        </span>
      );
      break;
  }

  return (
    <div style={{ marginLeft: (indent * 1.5) + 'em' }}>
      { getMutationIcon(mutation.kind) }
      { mutationBit }
    </div>
  );
}
function normalizeMutationPath(mutations, state, filter) {
  var r, isThereAnyFilter = filter && filter !== '';

  if (isThereAnyFilter) {
    r = new RegExp(filter, 'i');
  }

  return mutations
    .map(({ path, ...rest }) => ({
      ...rest,
      path: path ? convertPathPartsToItems(path, state) : path,
      filterRegExp: r
    }))
    .filter(mutation => {
      if (!mutation.path || !isThereAnyFilter) return true;
      return mutation.path.find((part, index) => {
        const match = part.toString().match(r);

        if (match) {
          let tokens = part.split(r);

          tokens = tokens.reduce((soFar, token, i) => {
            if (i > 0) soFar.push(<strong style={{ color: 'red' }}>{ match[0] }</strong>);
            soFar.push(token);
            return soFar;
          }, []);

          mutation.newPath = [joinReact('', tokens)].concat(mutation.path.slice(index + 1));
          return true;
        };
        return false;
      });
    })
    .map(mutation => {
      if (mutation.newPath) {
        mutation.path = mutation.newPath;
        delete mutation.newPath;
      }
      return mutation;
    });
}

export default function HTMLMutation({ pinnedEvent, filter }) {
  var mutations = pinnedEvent.stateMutation;

  if (!mutations) return null;

  return (
    <div className='stateMutation'>
      <div className='diff'></div>
      {
        normalizeMutationPath(mutations, pinnedEvent.state, filter)
          .map((mutation, i) => <div key={i}>{ formatSingleMutation(mutation, 0) }</div>)
      }
    </div>
  );
};

HTMLMutation.propTypes = {
  pinnedEvent: PropTypes.object,
  filter: PropTypes.string
};
