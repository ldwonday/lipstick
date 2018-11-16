/* eslint-disable prettier/prettier */
import config from '../../config';
import request from '../../utils/request';

const { formId } = config.api;

export const submit = id => {
  return request(formId.submit(id), {
    customToken: true,
    showFailMsg: false,
    async: true
  });
};