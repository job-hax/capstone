import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function agreementReducer(
  state = initialState.agreement,
  action
) {
  switch (action.type) {
    case types.LOAD_AGREEMENT_SUCCESS:
      return action.agreement;
    default:
      return state;
  }
}
