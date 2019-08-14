import React, { Component } from 'react';

class CreateNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
    };
  }

  handleCreateNewBoard = (e) => {
    e.preventDefault();
    this.props.handleCreateNewBoard(this.state.name);
  };

  handleChange = (event) => {
    this.setState({ name: event.target.value });
  };

  render() {
    const { name } = this.state;
    return (
      <div>
        <form style={{ marginBottom: 20 }} onSubmit={this.handleCreateNewBoard}>
          <input
            value={name}
            onChange={this.handleChange}
            type="text"
          />
          <input type="submit" value="Create new board" />
        </form>
      </div>
    );
  }
}

export default CreateNew;
