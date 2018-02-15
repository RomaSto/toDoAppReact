import React, { Component } from 'react';
 const TodosList = ({ todosFromServer, handleDelete, handleToggle }) => {
  console.log(todosFromServer)
  if (todosFromServer) {
    let todosArray = Object.keys(todosFromServer).map(key => {
      return {
        'uid': key,
        'text': todosFromServer[key].text,
        'completed': todosFromServer[key].completed
      }
    })
    console.log(todosArray)
    return <div>
      <h2>List of Usernames of Users</h2>
      <p>(Saved on Sign Up in Firebase Database)</p>
      <ul>
        {todosArray.map(todo =>
          <li id={todo.uid} key={todo.uid} ><span style={todo.completed ? { 'textDecorationLine': 'line-through' } : { 'textDecorationLine': 'none' }} onClick={(e) => handleToggle(e, todo.completed)}>{todo.text}</span> <a onClick={handleDelete} >delete</a></li>
        )}
      </ul>
    </div>
  }
  else {
    return null
  }

}
export default  TodosList