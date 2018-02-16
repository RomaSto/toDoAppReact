import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import React, { Component } from 'react';
import { db } from '../../firebase';
import * as firebase from 'firebase';

// fake data generator
const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

// using some little inline style helpers to make the app look okay
const grid = 8;
const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle,
});
const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250,
});

class TodosList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todosArray: []
    };
    const { handleDelete, handleToggle } = this.props;


    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    let todosFromServer = nextProps.todosFromServer
    if (todosFromServer) {

      let todosArray = Object.keys(todosFromServer).map(key => {
        return {
          'uid': key,
          'text': todosFromServer[key].text,
          'completed': todosFromServer[key].completed,
          'priority': todosFromServer[key].priority
        }
      }).sort((a,b) => a.priority - b.priority)
      this.setState({ todosArray }) 
      // console.log(todosArray)
    } 
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const todosArray = reorder(
      this.state.todosArray,
      result.source.index,
      result.destination.index
    );
    console.log(result)
    let obj ={};
    todosArray.forEach((e, i) => {
      let uid = e.uid
      obj[uid] = {'completed': e.completed, 'text': e.text, 'priority': i}

    })
    
    db.updatePriority(firebase.auth().currentUser, obj).then((e) =>console.log(e))

    this.setState({
      todosArray,
    });
    // console.log(this.state.todosArray)
  }
  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {this.state.todosArray.map((item, index) => (
                <Draggable key={item.uid} draggableId={item.uid} index={index}>
                  {(provided, snapshot) => (
                    <div>
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style,
                        )}
                      >
                        {item.text}
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

export default TodosList