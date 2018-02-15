import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import * as firebase from 'firebase';

import withAuthorization from '../Session/withAuthorization';
import { db } from '../../firebase';
import {auth} from '../../firebase/firebase';
import { CREATE_TODO_REQUEST } from '../../actions/actionTypes'
import TodosList from './TodoList1'


class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = { todoInput: '', todosFromServer: []}
    this.authUser = this.props.authUser;
    this.push = this.push.bind(this);
    this.priority = 0;
  }
  componentDidMount() {
//     const { onSetUsers } = this.props;
// console.log(this.props.users)
//     db.onceGetUsers().then(snapshot =>
//       onSetUsers(snapshot.val())
//     );
     db.getTodos(firebase.auth().currentUser.uid).on('value', (snapshot) => {
      // console.log(snapshot.val());

      let todosFromServer = snapshot.val()
      
       this.setState({ todosFromServer });
       console.log(this.state.todosFromServer)
    });


  }



  handleChange= (event) => {
    this.setState({ todoInput: event.target.value });
  }

  handleDelete = (event) => {
    db.deleteTodo(firebase.auth().currentUser.uid, event.target.parentNode.id)

  }

  handleToggle = (event, completed) => {
    db.toggleTodo(firebase.auth().currentUser.uid, event.target.parentNode.id, !completed)
    console.log(completed);
    console.log('event');
  }

push (e)  {

  // console.log(this.props.authUser)
  // db.doCreateUser(this.props.authUser.uid, this.authUser.displayName, this.authUser.email)
  if (this.state.todoInput !== "") {

    db.push(this.props.authUser, { 'text':this.state.todoInput, 'completed': false, 'priority': this.priority})
    this.priority ++
  }
  this.setState({ todoInput: '' });
  e.preventDefault()
    // db.ref(`toDos/${this.props.authUser.uid}`).set({
    //   [Date.now()]: 'fuck'
    // });
    // db.ref('data').push().set({ "id": })
    // return new Promise((resolve, reject) => {

    //     // .push(action.text, error => error ? reject(error) : resolve());
    // });
  }

  render() {
    const { users } = this.props;

    return (
      <div>
        <h1>Home</h1>
        <p>The Home Page is accessible by every signed in user.</p>
        <form onSubmit={this.push}>
        <input type="text" value={this.state.todoInput} onChange={this.handleChange} />
        <button type='submit' >add toDo</button>
        </form>
        <TodosList handleDelete={this.handleDelete} handleToggle={this.handleToggle} todosFromServer={this.state.todosFromServer}/>
      </div>
    );
  }
}



const mapStateToProps = (state) => ({
  users: state.userState.users,
});

const mapDispatchToProps = (dispatch) => ({
  onSetUsers: (users) => dispatch({ type: 'USERS_SET', users }),
  // onCreateTodoRequest: ( users) => { console.log( users); return dispatch({ type: CREATE_TODO_REQUEST, users })},
});

const authCondition = (authUser) => !!authUser;

export default compose(
  withAuthorization(authCondition),
  connect(mapStateToProps, mapDispatchToProps)
)(HomePage);
