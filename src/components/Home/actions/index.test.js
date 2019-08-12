import * as actions from './index'
import * as types from '../../../constants/actions'

describe('actions', () => {
  it('should create an action to add a todo', () => {
    const boardId = 34
    const expectedAction = {
      type: types.GET_BOARD,
      payload: { boardId: boardId },
    }
    expect(actions.getBoard(boardId)).toEqual(expectedAction)
  })
})

describe('actions', () => {
  it('should create an action to add a todo', () => {
    const expectedAction = {
      type:  types.GET_BOARD_SUCCESS,
      payload: { lanes: [], users: [] },
    }
    expect(actions.getBoardSuccess()).toEqual(expectedAction)
  })
})

describe('actions', () => {
  it('should create an action to add a todo', () => {
    const id = 1
    const userId = 2
    const board = {}
    const expectedAction = {
      type: types.UPDATE_BOARD,
      payload: {
        boardId:id,
        board,
         userId,
      },
    }
    expect(actions.updateBoard(id , board, userId)).toEqual(expectedAction)
  })
})

describe('actions', () => {
  it('should create an action to add a todo', () => {
    const email = 'string'
    const id = 2
    const uid = 234
    const name ='name'
    const  resolve = ()=> {}
    const reject = () => {}
    const expectedAction = {
      type: types.SHARE_BOARD,
      payload: {
        email,
        userUid: uid,
        boardId: id,
        boardName: name,
        resolve,
        reject,
      },
    }
    expect(actions.shareBoard({email, uid, id , name, resolve , reject})).toEqual(expectedAction)
  })
})

