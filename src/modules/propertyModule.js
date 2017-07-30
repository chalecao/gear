// import store from '../service/vuexService'
// import Vue from 'vue'
const propertyModule = {
    state: {
        el: ""
    },
    mutations: {
        SetPropertyType(state, payload) {
            state.type = payload
        },
        SetPropertyData(state, payload) {
            if (payload) {
                state.el = payload;
            }
        },
        UpdatePropertyData(state, payload) {

        },
        CleanProperty(state, payload) {
            state.el = "";
        }
    },
    // Action 提交的是 mutation，而不是直接变更状态。
    // Action 可以包含任意异步操作。
    actions: {
        SetPropertyData: ({
            commit
        }, data) => commit('SetPropertyData', data)
    },
    // 可以认为是 store 的计算属性
    getters: {}
}

export default propertyModule
