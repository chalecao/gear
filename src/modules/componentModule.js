// import store from '../service/vuexService'
// import Vue from 'vue'
const componentModule = {
    state: {
        defaultComponentUrl: '',
        mainComponent: '',
        current: 0
    },
    mutations: {
        ChangeComponentUrl(state, payload) {
            state.defaultComponentUrl = payload.url
            state.mainComponent = payload.mainComponent
        },
        SetComponentCurrent(state, payload) {
            state.current = payload
        }
    },
    // Action 提交的是 mutation，而不是直接变更状态。
    // Action 可以包含任意异步操作。
    actions: {},
    // 可以认为是 store 的计算属性
    getters: {
        getComponentUrl: state => {
            return state.defaultComponentUrl
        }
    }
}

export default componentModule
