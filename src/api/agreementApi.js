import { handleResponse, handleError } from './apiUtils';
const baseUrl = process.env.API_URL + '/agreements';

export function getAgreement() {
  return fetch(baseUrl)
    .then(handleResponse)
    .catch(handleError);
}
