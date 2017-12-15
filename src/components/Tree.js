import React from 'react';
import PropTypes from 'prop-types';
import { renderStateAsTree } from '../helpers/renderAsTree';
import { createRawMachine } from '../stent/Raw';
import { connect as connectWithMachineOnly } from 'stent/lib/helpers';

export default class Tree extends React.Component {
  constructor(props) {
    super(props);

    this.machine = createRawMachine();

    connectWithMachineOnly().with(this.machine).mapSilent(() => this.forceUpdate());
  }
  _changeFormat() {
    if (this.machine.isRaw()) {
      this.machine.viewFormatted();
    } else {
      this.machine.viewRaw();
    }
  }
  render() {
    const { data, renderer, onItemClick } = this.props;

    if (!data) return null;

    const tree = (renderer || renderStateAsTree)(data, onItemClick);

    return (
      <div>
        { this.machine.isRaw() ? <pre className="rawFormat">{ JSON.stringify(data, null, 2) }</pre> : tree }
        <a onClick={ () => this._changeFormat() } className='treeFormat'>
          <i className='fa fa-tv' style={{ marginRight: '0.2em' }}></i>
          { this.machine.isRaw() ? 'tree' : 'raw' }
        </a>
      </div>
    );
  }
};

Tree.defaultPropTypes = {
  renderer: renderStateAsTree
};

Tree.propTypes = {
  data: PropTypes.any,
  renderer: PropTypes.func,
  onItemClick: PropTypes.func
};
