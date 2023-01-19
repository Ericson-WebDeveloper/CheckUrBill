import axios from "axios";
import { getCookie } from '../helpers/js-cookies';


let axs = axios.create({
    baseURL: 'http://localhost:8000',
});

// Add a request interceptor
axs.interceptors.request.use(function (config) {
    // Do something before request is sent
    const token = getCookie('auth_token');
    config.headers!.Authorization =  'Bearer ' + token;
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
axs.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});


export default axs;