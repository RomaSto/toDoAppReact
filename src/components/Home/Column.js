// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

import TodosList from './TodoList1'
const Title = styled.h4`
  padding: 15px;
  cursor: grab;
  transition: background-color ease 0.2s;
  flex-grow: 1;
  user-select: none;
  position: relative;
  &:focus {
    outline: 2px solid purple;
    outline-offset: 2px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  margin: 15px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  background-color: ${({ isDragging }) => (isDragging ? 'blue' : 'red')};
  transition: background-color 0.1s ease;

  &:hover {
    background-color: ${'blue'};
  }
`;


export default class Column extends Component {
  render() {
    const title = this.props.title;
    const quotes = this.props.quotes;
    const index = this.props.index;
    return (
      <Draggable draggableId={title} index={index}>
        {(provided, snapshot) => (
          <Wrapper>
            <Container
              innerRef={provided.innerRef}
              {...provided.draggableProps}
            >
              <Header isDragging={snapshot.isDragging}>
                <Title
                  isDragging={snapshot.isDragging}
                  {...provided.dragHandleProps}
                >
                  {title}
                </Title>
              </Header>
              <TodosList
                listId={title}
                listType="QUOTE"
                quotes={quotes}
                autoFocusQuoteId={this.props.autoFocusQuoteId}
              />
            </Container>
            {provided.placeholder}
          </Wrapper>
        )}

      </Draggable>
    );
  }
}