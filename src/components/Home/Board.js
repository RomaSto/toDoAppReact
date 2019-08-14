import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import * as firebase from 'firebase';
import _ from 'lodash';
import Board from 'react-trello';
import Share from './Share';
import {shareBoard, getBoard, getBoardSuccess, updateBoard} from "./actions"

class BoardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { eventBus: undefined };
  }

  componentDidMount() {
this.props.getBoard(this.props.match.params.id)
  }

  componentWillUnmount() {
    this.props.getBoardSuccess()
  }

  handleShareBoard = ({ email, resolve, reject }) => {
    const { id, name } = this.props.board;
   const uid = firebase.auth().currentUser.uid
   const res =   this.props.shareBoard( {email, uid, id , name, resolve , reject})
  };

  handleBoardUpdate = (board) => {
    if (!_.isEqual(board, this.props.board) && this.props.board.lanes.length) {
      const { name, id, users} = this.props.board
      board.name = name;
      board.id = id;
      board.users = users;
      this.props.updateBoard(id, board,this.props.userId)
    }
  };

  normalizeTodos = (board) => {
    const newBoard = {};
    console.log(board);

    newBoard.lanes = board.lanes.map((lane) => {
      const newLane = _.clone(lane, true);
      if (!newLane.cards) {
        newLane.cards = [];
      }

      return newLane;
    });
    return newBoard;
  };

  render() {
    const {
      props: { board },
      handleBoardUpdate,
      normalizeTodos,
    } = this;
    console.log('props', this.props);

    return (
      <div>
        <h4>{board && board.name}</h4>

        <div>
          <span>Users:</span>
          <ul>
            {board && Object.keys(board.users).map(el => <li>{board.users[el]}</li>)}
          </ul>
          <Share handleShareBoard={this.handleShareBoard} />
        </div>
        {board && (
          <Board
            id={Math.random().toString()}
            data={normalizeTodos(board)}
            draggable
            editable
            laneDraggable={false} // onCardAdd={handleCardAdd}
            onDataChange={handleBoardUpdate}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  board: state.todosReducer.currentBoard,
});

const mapDispatchToProps = {

  shareBoard,
  getBoard,
  getBoardSuccess,
  updateBoard,
}


export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(BoardContainer);
