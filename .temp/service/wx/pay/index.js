/* eslint-disable prettier/prettier */
import config from '../../../config';
import request from '../../../utils/request';

const { wx: { pay } } = config.api;

export const retrieveOrder = orderNo => {
  return request(pay.retrieve(orderNo), {
    customToken: true
  });
};
export const withDraw = (amount, formId) => {
  return request(pay.withdraw, {
    method: 'POST',
    customToken: true,
    contentType: 'application/json',
    body: {
      amount,
      formId
    }
  });
};