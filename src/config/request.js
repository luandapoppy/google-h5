import axios from 'axios' // 引用axios
import router from '../router'
import Vue from 'vue';
import { baseUrl } from './env';
import { getStore } from './mUtil';
var TokenInvalidFlag = 0;

const vm = new Vue();

// axios 配置
axios.defaults.timeout = 20000 //设置接口响应时间
axios.defaults.baseURL = baseUrl;

// core请求
const core_prefix = "/web/callService/"

// http request 拦截器
axios.interceptors.request.use(function(config) {
  vm.$toast.loading();
  var url = config.url;
  const token = getStore('token');
  const currentMember = JSON.parse(getStore('currentMember'));
  config.data.token = token;
  if (!config.data.noMember && currentMember && currentMember.memberId) {
    config.data.memberId = currentMember.memberId;
  }
  return config;
}, function(error) {
  vm.$toast.fail('网络请求失败，错误信息：' + error.toString());
  return Promise.reject(error);
});

// http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.data.code === "400003") {
      TokenInvalidFlag = 1;
      router.push("/login");
      return;
    } else if (response.data.code == '0') {
      vm.$toast.clear();
      return response;
    } else {
      vm.$toast.clear();
      return Promise.reject(response)
    }
    TokenInvalidFlag = 0;
    return response;
  },
  error => {
    vm.$toast.fail({ message: '请求失败，错误信息：' + error.toString() });
    return Promise.reject(error.response)
  }
)

export default axios

/**
 * get 请求方法
 * @param url
 * @param params
 * @returns {Promise}
 */
export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(core_prefix + url, { params: params }).then(response => {
      resolve(response.data)
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * post 请求方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data) {

  return new Promise((resolve, reject) => {
    axios.post(core_prefix + url, data).then(
      response => {
        resolve(response.data);
      },
      err => {
        reject(err)
      }
    )
  })
}