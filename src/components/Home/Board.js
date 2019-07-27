import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import * as firebase from "firebase";
import _ from "lodash";
import Share from "./Share";

import withAuthorization from "../Session/withAuthorization";
import { db } from "../../firebase";
import { auth } from "../../firebase/firebase";
import Board from "react-trello";

// let eventBus = undefined;
class BoardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { eventBus: undefined };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    console.log("dddd", "componentDidMount");

    dispatch({
      type: "GET_BOARD",
      payload: { boardId: this.props.match.params.id }
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: "GET_BOARD_SUCCESS",
      payload: { lanes: [], users: [] }
    });
  }

  // setEventBus = handle => {
  //   this.setState({ eventBus: handle });
  // };
  // shouldComponentUpdate(nextProps, nextState, nextContext) {
  //   console.log("fdsfsdfs", nextProps.board, this.props.board);
  //   if (_.isEqual(nextProps.board, this.props.board)) {
  //     console.log("fdsfsdfs");

  //     return false;
  //   }
  //   return true;
  // }
  handleShareBoard = ({ email, resolve, reject }) => {
    let res = this.props.dispatch({
      type: "SHARE_BOARD",
      payload: {
        email,
        userUid: firebase.auth().currentUser.uid,
        boardId: this.props.board.id,
        boardName: this.props.board.name,
        // userName: firebase.auth().currentUser.displayName,
        resolve,
        reject
      }
    });
    console.log("res1", res);
  };
  handleBoardUpdate = board => {
    // console.log(card, laneId, this.props.authUser);
    console.log("card", board);
    const { dispatch } = this.props;
    if (!_.isEqual(board, this.props.board) && this.props.board.lanes.length) {
      // this.state.eventBus.publish({type: 'UPDATE_LANES', lanes: newLaneData});
      board.name = this.props.board.name;
      board.id = this.props.board.id;
      board.users = this.props.board.users;
      dispatch({
        type: "UPDATE_BOARD",
        payload: {
          boardId: this.props.board.id,
          board,
          userId: this.props.userId
          // eventBus: this.state.eventBus
        }
      });
    }
  };
  normalizeTodos = board => {
    let newBoard = {};
    console.log(board);

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
      props: { board },
      handleBoardUpdate,
      normalizeTodos
    } = this;
    console.log("props", this.props);

    return (
      <div>
        <h4>{board && board.name}</h4>

        <div>
          <span>Users:</span>
          <ul>
            {Object.keys(board.users).map(el => {
              return <li>{board.users[el]}</li>;
            })}
          </ul>
          <Share handleShareBoard={this.handleShareBoard} />
        </div>
        {board && (
          <Board
            // eventBusHandle={setEventBus}
            id={Math.random().toString()}
            data={normalizeTodos(board)}
            draggable={true}
            editable={true}
            laneDraggable={false} // onCardAdd={handleCardAdd}
            onDataChange={handleBoardUpdate}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  // users: state.userReducer.users,
  board: state.todosReducer.currentBoard
  // updateBoardPending: state.todosReducer.updateBoardPending
  // state
});

const mapDispatchToProps = dispatch => ({
  dispatch
  // onSetUsers: users => dispatch({ type: "USERS_SET", users })
  // onCreateTodoRequest: ( users) => { console.log( users); return dispatch({ type: CREATE_TODO_REQUEST, users })},
});

const authCondition = authUser => !!authUser;

export default compose(
  // withAuthorization(authCondition),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(BoardContainer);
