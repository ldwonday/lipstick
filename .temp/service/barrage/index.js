/* eslint-disable prettier/prettier */
import config from '../../config';
import request from '../../utils/request';

const { barrage } = config.api;
const baseQs = {
  qs: {
    appId: config.appId
  }
};
export const productBarrage = () => {
  return request(barrage.product, {
    qs: {
      ...baseQs.qs
    }
  });
};
export const profitBarrage = productId => {
  return request(barrage.profit, {
    qs: {
      ...baseQs.qs,
      productId
    }
  });
};
export const emptyBarrage = productId => {
  return request(barrage.empty, {
    qs: {
      ...baseQs.qs,
      productId
    }
  });
};