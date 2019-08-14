import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import * as firebase from 'firebase';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import withAuthorization from '../Session/withAuthorization';
import CreateNew from './CreateNew';
import {
  createBoard,
  } from "./actions"

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // name: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'GET_BOARDS',
      payload: { id: firebase.auth().currentUser.uid },
    });
  }
  handleCreateNewBoard = (name) => {
    const user = firebase.auth().currentUser;
    this.props.createBoard(name, user)
  };

  render() {
    const {
      props: { boards },
      handleCreateNewBoard,
    } = this;

    return (
      <div>
        <h1>Home</h1>
        <p>The Home Page is accessible by every signed in user.</p>
        <CreateNew handleCreateNewBoard={handleCreateNewBoard} />
        <ul>
          {Object.keys(boards).map((board) => {
            return (
              <li key={boards[board].boardId}>
                <Link
                  to={{
                    pathname: `home/boards/${boards[board].boardId}`,
                  }}
                >
                  {boards[board].boardName}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
HomePage.propTypes = {
  dispatch: PropTypes.object.isRequired,
  boards: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  boards: state.todosReducer.boards,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  createBoard,
});

const authCondition = authUser => !!authUser;

export default compose(
  withAuthorization(authCondition),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(HomePage);
