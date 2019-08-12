import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import * as firebase from 'firebase';
// import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
// import _ from 'lodash';

import PropTypes from 'prop-types';
import withAuthorization from '../Session/withAuthorization';
// import { db } from '../../firebase';
// import Board from './Board';
import CreateNew from './CreateNew';
import {
  createBoard,
  //  onSetUsers
  } from "./actions"


// import { auth } from '../../firebase/firebase';

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
            console.log('boardHome', boards[board]);

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
  // onSetUsers: users => dispatch({ type: 'USERS_SET', users }),
});

const authCondition = authUser => !!authUser;

export default compose(
  withAuthorization(authCondition),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(HomePage);
