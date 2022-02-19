import axios from "axios";

const request = async (params) => {
  try {
    const { status, headers, data } = await axios.request(params);
    return { status, headers, data };
  } catch (e) {
    throw e;
  }
};

export const post = async (params) => {
  return request({
    method: "post",
    url: params.url,
    headers: params.headers,
    data: params.body,
  });
};

export const put = async (params) => {
  return request({
    method: "put",
    url: params.url,
    headers: params.headers,
    data: params.body,
  });
};

export const get = async (params) => {
  return request({
    method: "get",
    url: params.url,
    headers: params.headers,
  });
};

export const patch = async (params) => {
  return request({
    method: "patch",
    url: params.url,
    headers: params.headers,
    data: params.body,
  });
};

export const remove = async (params) => {
  return request({
    method: "delete",
    url: params.url,
    headers: params.headers,
  });
};
