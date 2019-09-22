import * as types from './actionTypes';
import * as agreementApi from '../../api/agreementApi';

export function loadAgreementSuccess(agreement) {
  return { type: types.LOAD_AGREEMENT_SUCCESS, agreement };
}

export function loadAgreement() {
  return function(dispatch) {
    return agreementApi
      .getAgreement()
      .then(agreement => {
        dispatch(loadAgreementSuccess(agreement.data));
      })
      .catch(error => {
        throw error;
      });
  };
}
