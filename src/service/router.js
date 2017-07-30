import Vue from 'vue'
import Router from 'vue-router'
import ErrorView from '@/views/ErrorView'
import PageView from '@/views/PageView'
import ModuleView from '@/views/ModuleView'
import ComponentView from '@/views/ComponentView'
import ElementView from '@/views/ElementView'
import DataView from '@/views/DataView'
import TestView from '@/views/TestView'
import PoolView from '@/views/PoolView'
import ProjectView from '@/views/ProjectView'
// import PropertyView from '@/views/PropertyView'

// import CommonPropertyView from '@/views/CommonPropertyView'
import CommonModuleView from '@/views/pool/PoolModuleView'
import CommonComponentView from '@/views/pool/PoolComponentView'

Vue.use(Router)

const routes = [{
    path: '/',
    redirect: 'project'
}, {
    path: '/page',
    name: 'PageView',
    component: PageView,
    children: [{
        path: 'module',
        name: 'ModuleView',
        component: ModuleView
    }, {
        path: 'component',
        name: 'ComponentView',
        component: ComponentView
    }, {
        path: 'element',
        name: 'ElementView',
        component: ElementView
    }, {
        path: 'data',
        name: 'DataView',
        component: DataView
    }, {
        path: 'test',
        name: 'TestView',
        component: TestView
    }, {
        path: '/',
        redirect: 'module'
    }]
}, {
    path: '/pool',
    name: 'PoolView',
    component: PoolView,
    children: [{
        path: 'module',
        name: 'CommonModuleView',
        component: CommonModuleView
    }, {
        path: 'component',
        name: 'CommonComponentView',
        component: CommonComponentView
    }, {
        path: '/',
        redirect: 'module'
    }]
}, {
    path: '/project',
    name: 'ProjectView',
    component: ProjectView
}, {
    path: '*',
    component: ErrorView
}]
const router = new Router({
    hashbang: false, // 将路径格式化为#!开头
    history: true, // use history=false when testing
    mode: 'hash',
    base: __dirname,
    linkActiveClass: 'active',
    routes // （缩写）相当于 routes: routes
})
export default router
