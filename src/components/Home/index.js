import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import * as firebase from "firebase";

import withAuthorization from "../Session/withAuthorization";
import { db } from "../../firebase";
import { auth } from "../../firebase/firebase";
import { CREATE_TODO_REQUEST } from "../../actions/actionTypes";
import Board from "react-trello";
const data = {
  lanes: [
    {
      id: "planned",
      title: "Planned Tasks",
      label: "2/2",
      cards: [
        {
          id: "Card2",
          title: "Pay Rent",
          description: "Transfer via NEFT",
          label: "5 mins",
          metadata: { sha: "be312a1" }
        },
        {
          id: "Card1",
          title: "Write Blog",
          description: "Can AI make memes",
          label: "30 mins"
        }
      ]
    },
    {
      id: "completed",
      title: "Completed",
      label: "0/0",
      cards: []
    }
  ]
};

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todoInput: "",
      todosFromServer: []
      // boardData: {
      //   lanes: [
      //     {
      //       id: "planned",
      //       title: "Planned Tasks",
      //       label: "2/2",
      //       cards: []
      //     },
      //     {
      //       id: "completed",
      //       title: "Completed",
      //       label: "0/0",
      //       cards: []
      //     }
      //   ]
      // }
    };

    // this.priority = 0;
  }
  componentDidMount() {
    //     const { onSetUsers } = this.props;
    // console.log(this.props.users)
    //     db.onceGetUsers().then(snapshot =>
    //       onSetUsers(snapshot.val())
    //     );
    // const { dispatch } = this.props;
    // dispatch({
    //   type: "GET_TODOS",
    //   payload: { id: firebase.auth().currentUser.uid }
    // });
    // db.getTodos(firebase.auth().currentUser.uid).on("value", snapshot => {
    //   console.log("snapshot", snapshot.val());
    //   let todosFromServer = snapshot.val();
    //   console.log(Object.keys(todosFromServer));
    //   Object.keys(todosFromServer).map(el => {});
    //   // this.setState({ todosFromServer });
    //   // console.log(this.state.todosFromServer);
    // });
  }

  // handleChange= (event) => {
  //   this.setState({ todoInput: event.target.value });
  // }

  // handleDelete = (event) => {
  //   db.deleteTodo(firebase.auth().currentUser.uid, event.target.parentNode.id)

  // }

  // handleToggle = (event, completed) => {
  //   db.toggleTodo(firebase.auth().currentUser.uid, event.target.parentNode.id, !completed)
  //   console.log(completed);
  //   console.log('event');
  // }
  // componentDidUpdate(prevProps, prevState) {
  //   if (!this.props.todos) {
  //   }
  // }

  handleCardAdd = (card, laneId) => {
    // console.log(card, laneId, this.props.authUser);
    console.log(card, laneId);

    // db.doCreateUser(this.props.authUser.uid, this.authUser.displayName, this.authUser.email)
    const { dispatch } = this.props;
    // dispatch({
    //   type: "ADD_TODO",
    //   payload: { userUid: this.props.authUser.uid, card, laneId }
    // });
    // db.push(this.props.authUser, {
    //   ...card,
    //   laneId
    // });
    // this.priority++;
    // this.setState({ todoInput: "" });
    // e.preventDefault();
    // db.ref(`toDos/${this.props.authUser.uid}`).set({
    //   [Date.now()]: 'fuck'
    // });
    // db.ref('data').push().set({ "id": })
    // return new Promise((resolve, reject) => {

    //     // .push(action.text, error => error ? reject(error) : resolve());
    // });
  };

  render() {
    const {
      props: { users, todos },
      state: { boardData },
      handleCardAdd
    } = this;
    console.log("props", this.props);

    return (
      <div>
        <h1>Home</h1>
        <p>The Home Page is accessible by every signed in user.</p>
        {
          // <form onSubmit={this.push}>
          //     <input
          //       type="text"
          //       value={this.state.todoInput}
          //       onChange={this.handleChange}
          //     />
          //     <button type="submit">add toDo</button>
          //   </form>
          //   <TodosList
          //     handleDelete={this.handleDelete}
          //     handleToggle={this.handleToggle}
          //     todosFromServer={this.state.todosFromServer}
          //   />
        }
        <Board
          canAddLanes={true}
          data={todos}
          draggable={true}
          editable={true}
          laneDraggable={false}
          onCardAdd={handleCardAdd}
          // onDataChange={d => {
          //   handleCardAdd(d);
          //   console.log(d);
          // }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  users: state.userReducer.users,
  todos: state.todosReducer.todos,
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
