import axios from 'axios';

let baseURL = '/api';

export const doLogin = param => { return axios.post(`${baseURL}/login`, param); }
export const uploadUUID = param => { return axios.post(`${baseURL}/uuid`, param, { headers: { Authorization: window.sessionStorage.getItem('token') } }); }
export const getWorkSetList = param => { return axios.post(`${baseURL}/getworksetlist`, param, { headers: { Authorization: window.sessionStorage.getItem('token') } }) }
export const delWorkSet = param => { return axios.post(`${baseURL}/delworkset`, param, { headers: { Authorization: window.sessionStorage.getItem('token') } }) }
export const getByUUID = param => {return axios.post(`${baseURL}/getbyuuid`, param, { headers: { Authorization: window.sessionStorage.getItem('token') } }) }
export const getResult = param => {return axios.post(`${baseURL}/getresult`, param, { headers: { Authorization: window.sessionStorage.getItem('token') } }) }
export const search = param => {return axios.post(`${baseURL}/search`, param, { headers: { Authorization: window.sessionStorage.getItem('token') } }) }