import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import * as firebase from "firebase";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import _ from "lodash";

import withAuthorization from "../Session/withAuthorization";
import { db } from "../../firebase";
import Board from "./Board";
import CreateNew from "./CreateNew";

import { auth } from "../../firebase/firebase";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ""
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: "GET_BOARDS",
      payload: { id: firebase.auth().currentUser.uid }
    });
  }
  // shouldComponentUpdate(nextProps, nextState, nextContext) {
  //   console.log(
  //     _.isEqual(nextProps.boards, this.props.boards),
  //     "dfgsdfgdfsgdfs"
  //   );

  //   if (_.isEqual(nextProps.boards, this.props.boards)) {
  //     return false;
  //   }
  //   return true;
  // }
  // componentDidUpdate(prevProps, prevState) {
  //   if (prevProps.updateBoardPending && !this.props.updateBoardPending) {

  //     console.log("componentDidUpdate", prevProps, prevState, this.props);
  //   }
  // }
  handleCreateNewBoard = name => {
    const user = firebase.auth().currentUser;
    this.props.dispatch({
      type: "CREATE_BOARD",
      payload: {
        boardId: uuidv4(),
        name,
        userUid: user.uid,
        users: { [user.uid]: user.email }
      }
    });
  };

  render() {
    const {
      props: { boards },
      state: { boardData },
      handleCreateNewBoard,
      handleCardAdd,
      normalizeTodos
    } = this;
    console.log("props1", this.props);

    return (
      <div>
        <h1>Home</h1>
        <p>The Home Page is accessible by every signed in user.</p>
        <CreateNew handleCreateNewBoard={handleCreateNewBoard} />
        <ul>
          {Object.keys(boards).map(board => {
            console.log("boardHome", boards[board]);

            return (
              <li key={boards[board].boardId}>
                <Link
                  to={{
                    pathname: `home/boards/${boards[board].boardId}`

                    // state: { fromDashboard: true }
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

const mapStateToProps = state => ({
  // users: state.userReducer.users,
  boards: state.todosReducer.boards
  // updateBoardPending: state.todosReducer.updateBoardPending

  // state
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  onSetUsers: users => dispatch({ type: "USERS_SET", users })
  // onCreateTodoRequest: ( users) => { console.log( users); return dispatch({ type: CREATE_TODO_REQUEST, users })},
});

const authCondition = authUser => !!authUser;

export default compose(
  withAuthorization(authCondition),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(HomePage);
