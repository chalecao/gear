// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

// vue组件用大写字母开头表示，便于区分
import App from './App'
import PropertyView from './views/PropertyView'
import ViewportView from './views/ViewportView'
import NavView from './views/Nav'
import SideBar from './views/SideBar'
// js组件用小写字母开头
import store from './service/vuexService'
import router from './service/router'
import urlRouter from './service/urlRouter'

import '../static/css/bootstrap.css'
import '../static/css/common.scss'

Vue.config.productionTip = false
window.gear = window.gear || {}

/* eslint-disable no-new */
gear.app = new Vue({
    el: '#app',
    store,
    render: page => page(App)
})
gear.viewport = new Vue({
    el: '#viewportContainer',
    store,
    render: page => page(ViewportView)
})

gear.sidebar = new Vue({
    el: '#sideBarContainer',
    store,
    router,
    render: page => page(SideBar)
})
gear.peoperty = new Vue({
    el: '#propertyContainer',
    store,
    render: page => page(PropertyView)
})
gear.nav = new Vue({
    el: '#navContainer',
    store,
    render: page => page(NavView)
})
//初始化路由计算，匹配页面
// urlRouter.init()

