/**
 * Created by zhoou on 2016/11/28.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'

import logger from './logger' // 记录日志 ：logger 插件会生成状态快照，所以仅在开发环境使用。

import listModule from '../modules/listModule'
import projectModule from '../modules/projectModule'
import moduleModule from '../modules/moduleModule'
import componentModule from '../modules/componentModule'
import elementModule from '../modules/elementModule'
import propertyModule from '../modules/propertyModule'
import dataModule from '../modules/dataModule'
import viewportModule from '../modules/viewportModule'

import poolModuleModule from '../modules/poolModuleModule'
import poolComponentModule from '../modules/poolComponentModule'
import urlRouter from './urlRouter'

Vue.use(Vuex)
Vue.use(VueResource)

const store = new Vuex.Store({
    // plugins: [logger],
    state: {
        title: 'JSCODER',
        editMode: true,
        sideBarList: [{
            name: '页面组件',
            href: '/page',
            cls: ''
        }, {
            name: '项目列表',
            href: '/project',
            cls: ''
        }, {
            name: '通用库池',
            href: '/pool',
            cls: ''
        }, {
            name: '模板规范',
            href: '/template',
            cls: ''
        }, {
            name: '插件扩展',
            href: '/plugin',
            cls: ''
        }, {
            name: '<<',
            href: '',
            cls: 'disp'
        }],
        pageBarList: [{
            name: '页面',
            href: '/page/module'
        }, {
            name: '元素',
            href: '/page/element'
        }, {
            name: '数据',
            href: '/page/data'
        }, {
            name: '测试',
            href: '/page/test'
        }],
        poolBarList: [{
            name: '通用页面池',
            href: '/pool/module'
        }, {
            name: '通用组件池',
            href: '/pool/component'
        }],
        propertyBarList: [{
            name: '位置',
            type: 'position',
            href: '/page/element/property/position'
        }, {
            name: '展示',
            type: 'show',
            href: '/page/element/property/show'
        }, {
            name: '特性',
            type: 'special',
            href: '/page/element/property/special'
        }, {
            name: '其他',
            type: 'other',
            href: '/page/element/property/other'
        }]
    },
    mutations: {
        SetEditMode(state, payload) {
            state.editMode = payload
            window.gear['editMode'] = payload
            if (window.gear['editMode']) {
                urlRouter.reset()
            } else {
                urlRouter.init()
            }
        }
    },
    actions: {
        SetEditMode({
            commit
        }, data) {
            commit('SetEditMode', data)
        }
    },
    modules: {
        list: listModule,
        project: projectModule,
        module: moduleModule,
        component: componentModule,
        element: elementModule,
        property: propertyModule,
        data: dataModule,
        viewport: viewportModule,
        poolModule: poolModuleModule,
        poolComponent: poolComponentModule
    }
})

export default store
