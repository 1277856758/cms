import axios from "axios";
import {Loading, Message} from "element-ui";
import router from "../router/router";
axios.defaults.timeout = 60000;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;
axios.defaults.changeOrigin = true;
axios.defaults.baseURL= "http://10.10.12.248:8999/";
// axios.defaults.baseURL= "http://10.10.4.69:8999/";
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    Message.error({
        message: '错误的传参'
    });
    return Promise.reject(error)
});
axios.interceptors.response.use(function (response) {
    if (response.data.code == 300) {
      router.push({path: "/login"})
    } else if (response.data.code != 200) {
        Message.error({
            message: response.data.message
        });
        return Promise.reject(response);
    }
    return response;
}, function (error) {
    console.log(error);
    Message.error({
        message: '网络异常'
    });
    return Promise.reject(error);
});
export default axios;
