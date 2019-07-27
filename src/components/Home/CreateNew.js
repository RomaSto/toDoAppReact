import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import * as firebase from "firebase";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";

import withAuthorization from "../Session/withAuthorization";
import { db } from "../../firebase";
import Board from "./Board";
import { auth } from "../../firebase/firebase";

class CreateNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ""
    };
  }
  handleCreateNewBoard = e => {
    e.preventDefault();
    this.props.handleCreateNewBoard(this.state.name);
  };
  handleChange = event => {
    this.setState({ name: event.target.value });
  };

  render() {
    return (
      <div>
        <form style={{ marginBottom: 20 }} onSubmit={this.handleCreateNewBoard}>
          <input
            value={this.state.name}
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
