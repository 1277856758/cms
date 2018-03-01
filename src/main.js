import Vue from "vue";
import App from "./App";
import router from "./router/router";
import "./assets/css/comm.css";
import ElementUI from "element-ui";
import "element-ui/lib/theme-default/index.css";
import Filter from "./config/filter";
import axios from "./config/ajax_axios";
import  protorype  from "./config/protorype"
import animate from 'animate.css'
Vue.use(ElementUI);
Vue.prototype.axios = axios;

var vm = new Vue({
  el: '#app',
  router,
  axios,
  Filter,
  template: '<App/>',
  components: {App}

});


Vue.config.productionTip = false;
