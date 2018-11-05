
import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import Element from 'element-ui'
import { Message, MessageBox } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import Cookies from 'js-cookie'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog'// error log
import './permission' // permission control
// import './mock' // simulation data

import * as filters from './filters' // global filters

Vue.use(Element, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

Vue.prototype.$qiyang = function () {
  axios.get('http://192.168.10.116/dsb/public/area.js', { params: {}, withCredentials: false, headers: { 'Content-Type': 'application/json', 'Accept': '*/*' }})
  .then(function(response) {
//        Cookies.set('token', response.data.token)
//        Cookies.set('token', 'will')
        console.log(1, response)
      })
}

// 格式化人民币
Vue.prototype.$formatMoney = function (s) {
  if (/[^0-9\.]/.test(s)) return "invalid value";
  s = s.replace(/^(\d*)$/, "$1.");
  s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
  s = s.replace(".", ",");
  var re = /(\d)(\d{3},)/;
  while (re.test(s))
      s = s.replace(re, "$1,$2");
  s = s.replace(/,(\d\d)$/, ".$1");
  return s.replace(/^\./, "0.") + '元'

}

// 格式化时间
Vue.prototype.$formatTime = function (time) {
  if (time) {
    return (new Date(parseInt(time) * 1000).getFullYear()) + "-" + (new Date(parseInt(time) * 1000).getMonth() + 1) + "-" + (new Date(parseInt(time) * 1000).getDate()) + " " + (new Date(parseInt(time) * 1000).getHours()) + ":" + (new Date(parseInt(time) * 1000).getMinutes()) + ":" + (new Date(parseInt(time) * 1000).getSeconds())
  } else {
    return '-'
  }
}

// 关闭当前标签页
Vue.prototype.$deleteOneTag = function(route, query) {
  for (const val of this.$store.state.tagsView.visitedViews) {
    if (val.name === this.$route.name) {
      this.$store.dispatch('delVisitedViews', val).then((views) => {
        if (val.path === this.$route.path || val.name === this.$route.name) {
          if (query) {
            this.$router.push({path: route, query: query})
          } else {
            this.$router.push({path: route})
          }
        }
      })
    }
  }
}

// 导出Excell
Vue.prototype.$downloadExcell = function (obj) {
  let str = ''
  for (let key in obj) {
    if (key != 'url') {
      if (obj[key] instanceof Array && obj[key].length > 0) {
        str += '&'
        str += key + '='
        if (obj[key][0] instanceof Date) {
          str += obj[key][0].getTime() + ',' + obj[key][1].getTime()
        } else {
          str += obj[key][0] + ',' + obj[key][1]
        }

      } else if (obj[key] != '') {
        str += '&'
        str += key + '='+ obj[key]
      }
    }
  }
  console.log(str)
  window.open(process.env.BASE_API + obj.url + '?' + 'source=admin&token=' + Cookies.get('token') + str)
}

// 限制大于0的整数
Vue.prototype.$inputKeyUp = (e) => { // 输入框限制
//	console.log(window.arguments)
//  var event = window.event || arguments.callee.caller.arguments[0]
  let target = window.event ? (event.srcElement || event.target) : e.target
  console.log(target)
//  let target = event.srcElement || event.target
  if (target.value.length === 1) {
    target.value = target.value.replace(/[^1-9]/g, '')
  } else {
    target.value = target.value.replace(/\D/g, '')
  }
  return target.value
}
// 限制可输入0的整数
Vue.prototype.$inputKeyUp0100 = (e) => { // 输入框限制
//	console.log(window.arguments)
//  var event = window.event || arguments.callee.caller.arguments[0]
  let target = window.event ? (event.srcElement || event.target) : e.target
  console.log(target)
//  let target = event.srcElement || event.target
  target.value = target.value.replace(/\D/g, '')
  if (target.value >= 100) {
    target.value = 100
  }
  return target.value
}

Vue.prototype.$axios = function(params, type) {
//  console.log(1, params, type)
  const baseUrl = process.env.BASE_API
  if (type == 1) {
//    params.data.append('source', 'admin')
    params.data.append('token', Cookies.get('token') ? Cookies.get('token') : '')
  } else {
//    params.data.source = 'admin'
    params.data.token = Cookies.get('token') ? Cookies.get('token') : ''
  }
  if (this.$store.state.app.showLoadingNums < 1) {
    this.$store.state.app.showLoading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
  }
  this.$store.state.app.showLoadingNums++ // 开启请求数据

  if (params.url == '/business/offlinecreatepayqrcode' || '/business/offlinecreatetableqrcode') {
//    axios.defaults.timeout = 10000; //导出暂不定响应时间
  } else {
    axios.defaults.timeout = 10000; //响应时间
  }

  //返回状态判断(添加响应拦截器)
//  axios.interceptors.response.use((res) =>{
//    //对响应数据做些事
//    console.log('res', res)
////    if(!res.data.success){
////    // _.toast(res.data.msg);
////      return Promise.reject(res);
////    }
//    return res;
//  }, (error) => {
//    console.log("网络异常", 'fail')
////    _.toast("网络异常", 'fail');
//    return Promise.reject(error);
//  });
  if (params.type === 'get') {
    axios.get(baseUrl + params.url, { params: params.data, withCredentials: false, headers: { 'Content-Type': type == 1 ? 'multipart/form-data' : 'application/json', 'Accept': '*/*' }})
      .then((response) => {
//        Cookies.set('token', response.data.token)
//        Cookies.set('token', 'will')
//        if (response.data.code == 416) {
//          Message({
//            showClose: true,
//            message: response.data.info,
//            type: 'error'
//          })
//          params.fuc(response.data)
//        } else if (response.data.code == 1010) {
//          Cookies.remove('Admin-Token')
//          Cookies.remove('token')
//          location.reload()
//        } else if (response.data.code != 200) {
//          // params.fuc(response.data)
//          Message({
//            showClose: true,
//            message: response.data.info,
//            type: 'error'
//          })
          //          params.nowThis.$Modal.warning({
          //            content: response.data.msg,
          //            title: '警告',
          //            onOk: () => {
          //              params.nowThis.$store.commit('logout', this);
          //              params.nowThis.$store.commit('clearOpenedSubmenu');
          //              params.nowThis.$router.push({
          //                  name: 'login'
          //              })
          //            }
          //          })
//        } else {
          params.fuc(response.data)
//        }

//        结束loading
        this.$store.state.app.showLoadingNums-- // 开启请求数据
        if (this.$store.state.app.showLoadingNums < 1) {
          this.$store.state.app.showLoading.close()
        }
      })
      .catch((error) => {
        let mes = '加载超时 请检查网络！'
        if (error.response && error.response.status) {
          mes = '服务器错误，请联系管理员！'
        }
//        结束loading
        this.$store.state.app.showLoadingNums-- // 开启请求数据
        if (this.$store.state.app.showLoadingNums < 1) {
          this.$store.state.app.showLoading.close()
        }
        params.fuc(error)
        Message({
          showClose: true,
          message: mes,
          type: 'error'
        })
      })
  } else {
    axios.post(
      baseUrl + params.url,
      type == 1 ? params.data : JSON.stringify(params.data),
      {
        withCredentials: false,
        headers: { 'Content-Type': type == 1 ? 'multipart/form-data' : 'application/json' }
      })
      .then((response) => {
//        Cookies.set('token', response.data.token)
//                Cookies.set('token', 'will')
//        if (response.data.code == 416) {
//          Message({
//            showClose: true,
//            message: response.data.info,
//            type: 'error'
//          })
//          params.fuc(response.data)
//        } else if (response.data.code == 1010) {
//          Cookies.remove('Admin-Token')
//          Cookies.remove('token')
//          location.reload()
//        } else if (response.data.code != 200) {
//          Message({
//            showClose: true,
//            message: response.data.info,
//            type: 'error'
//          })
//        } else {
          params.fuc(response.data)
//        }

//        结束loading
        this.$store.state.app.showLoadingNums-- // 开启请求数据
        if (this.$store.state.app.showLoadingNums < 1) {
          this.$store.state.app.showLoading.close()
        }
      })
      .catch((error) => {
        let mes = '加载超时 请检查网络！'
        if (error.response && error.response.status) {
          mes = '服务器错误，请联系管理员！'
        }
//        结束loading
        this.$store.state.app.showLoadingNums-- // 开启请求数据
        if (this.$store.state.app.showLoadingNums < 1) {
          this.$store.state.app.showLoading.close()
        }
        params.fuc(error)
        Message({
          showClose: true,
          message: mes,
          type: 'error'
        })
      })
  }
}

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
