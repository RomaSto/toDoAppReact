
import React, { Component } from 'react';
import styled, { injectGlobal } from 'styled-components';
import Column from './Column';
// import reorder, { reorderQuoteMap } from '../reorder';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

 const reorderQuoteMap = ({
  quoteMap,
  source,
  destination,
}: ReorderQuoteMapArgs): ReorderQuoteMapResult => {
  const current = [...quoteMap[source.droppableId]];
  const next = [...quoteMap[destination.droppableId]];
  const target = current[source.index];

  // moving to same list
  if (source.droppableId === destination.droppableId) {
    const reordered = reorder(
      current,
      source.index,
      destination.index,
    );
    const result = {
      ...quoteMap,
      [source.droppableId]: reordered,
    };
    return {
      quoteMap: result,
      // not auto focusing in own list
      autoFocusQuoteId: null,
    };
  }

  // moving to different list

  // remove from original
  current.splice(source.index, 1);
  // insert into next
  next.splice(destination.index, 0, target);

  const result: QuoteMap = {
    ...quoteMap,
    [source.droppableId]: current,
    [destination.droppableId]: next,
  };

  return {
    quoteMap: result,
    autoFocusQuoteId: target.id,
  };
};
// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const ParentContainer = styled.div`
  height: ${({ height }) => height};
  overflow-x: hidden;
  overflow-y: auto;
`;

const Container = styled.div`
  min-height: 100vh;

  /* like display:flex but will allow bleeding over the window width */
  min-width: 100vw;
  display: inline-flex;
`;


export default class Board extends Component {
  /* eslint-disable react/sort-comp */

  state = {
    columns: this.props.initial,
    ordered: Object.keys(this.props.initial),
    autoFocusQuoteId: null,
  }

  boardRef: HTMLElement

  componentDidMount() {
    injectGlobal`
      body {
        background: 'blue';
      }
    `;
  }

  onDragStart = (initial) => {


    this.setState({
      autoFocusQuoteId: null,
    });
  }

  onDragEnd = (result) => {


    // dropped nowhere
    if (!result.destination) {
      return;
    }

    const source = result.source;
    const destination = result.destination;

    // reordering column
    if (result.type === 'COLUMN') {
      const ordered = reorder(
        this.state.ordered,
        source.index,
        destination.index
      );

      this.setState({
        ordered,
      });

      return;
    }

    const data = reorderQuoteMap({
      quoteMap: this.state.columns,
      source,
      destination,
    });

    this.setState({
      columns: data.quoteMap,
      autoFocusQuoteId: data.autoFocusQuoteId,
    });
  }

  render() {
    const columns = this.state.columns;
    const ordered = this.state.ordered;
    const { containerHeight } = this.props;

    const board = (
      <Droppable
        droppableId="board"
        type="COLUMN"
        direction="horizontal"
        ignoreContainerClipping={Boolean(containerHeight)}
      >
        {(provided) => (
          <Container innerRef={provided.innerRef}>
            {ordered.map((key, index) => (
              <Column
                key={key}
                index={index}
                title={key}
                quotes={columns[key]}
                autoFocusQuoteId={this.state.autoFocusQuoteId}
              />
            ))}
          </Container>
        )}
      </Droppable>
    );

    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        {this.props.containerHeight ? (
          <ParentContainer height={containerHeight}>{board}</ParentContainer>
        ) : (
            board
          )}
      </DragDropContext>
    );
  }
}