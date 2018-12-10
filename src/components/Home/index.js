import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import * as firebase from "firebase";
import _ from "lodash";

import withAuthorization from "../Session/withAuthorization";
import { db } from "../../firebase";
import { auth } from "../../firebase/firebase";
import { CREATE_TODO_REQUEST } from "../../actions/actionTypes";
import Board from "react-trello";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todoInput: "",
      todosFromServer: []
    };
  }
  componentDidMount() {
    //     const { onSetUsers } = this.props;
    // console.log(this.props.users)
    //     db.onceGetUsers().then(snapshot =>
    //       onSetUsers(snapshot.val())
    //     );
    const { dispatch } = this.props;
    dispatch({
      type: "GET_BOARDS",
      payload: { id: firebase.auth().currentUser.uid }
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.updateBoardPending && !this.props.updateBoardPending) {
      this.props.dispatch({
        type: "GET_BOARDS",
        payload: { id: firebase.auth().currentUser.uid }
      });
      console.log("componentDidUpdate", prevProps, prevState, this.props);
    }
  }

  handleCardAdd = (card, laneId) => {
    // console.log(card, laneId, this.props.authUser);
    console.log(card, laneId);
    const { dispatch } = this.props;
    // if (!_.isEqual(card, this.props.todos) && this.props.todos.lanes.length) {
    //   dispatch({
    //     type: "UPDATE_BOARD",
    //     payload: { userUid: this.props.authUser.uid, board: card }
    //   });
    // }
  };
  normalizeTodos = board => {
    let newBoard = {};
    newBoard.lanes = board.lanes.map(lane => {
      let newLane = _.clone(lane, true);
      if (!newLane.cards) {
        newLane.cards = [];
      }
      // newLane.label = newLane.cards.length;

      return newLane;
    });
    return newBoard;
  };

  render() {
    const {
      props: { users, boards },
      state: { boardData },
      handleCardAdd,
      normalizeTodos
    } = this;
    console.log("props", this.props);

    return (
      <div>
        <h1>Home</h1>
        <p>The Home Page is accessible by every signed in user.</p>
        {boards.map(board => {
          return (
            <Board
              data={normalizeTodos(board)}
              draggable={true}
              editable={true}
              laneDraggable={false} // onCardAdd={handleCardAdd}
              onDataChange={d => {
                console.log(d);
                handleCardAdd(d);
              }}
            />
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  users: state.userReducer.users,
  boards: state.todosReducer.boards,
  updateBoardPending: state.todosReducer.updateBoardPending,

  state
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
