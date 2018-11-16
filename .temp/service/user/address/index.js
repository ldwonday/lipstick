/* eslint-disable prettier/prettier */
import request from '../../../utils/request';
import config from '../../../config';

const { user: { address } } = config.api;
export const list = () => {
  return request(address.list, {
    customToken: true
  });
};
export const get = () => {
  return request(address.get, {
    customToken: true
  });
};
export const update = params => {
  return request(address.update(params.id), {
    method: 'POST',
    customToken: true,
    contentType: 'application/json',
    body: {
      ...params
    }
  });
};
export const add = params => {
  return request(address.add, {
    method: 'POST',
    customToken: true,
    contentType: 'application/json',
    body: {
      ...params
    }
  });
};
export const setDefault = id => {
  return request(address.setDefault(id), {
    method: 'POST',
    customToken: true
  });
};