// import store from '../service/vuexService'
// import Vue from 'vue'
import storage from '../service/localstorage'

if (!storage.get("dataList")) {
    storage.set("dataList", "[]")
}

const dataModule = {
    state: {
        current: 0,
        dataList: JSON.parse(storage.get("dataList")) || []
    },
    mutations: {
        SetDateCompCurrent(state, payload) {
            state.current = payload
        },
        AddData(state, payload) {
            state.dataList.push({
                thumbnail: payload
            })
            storage.set("dataList", JSON.stringify(state.dataList))
        },
        DelData(state, payload) {
            if (+payload >= 0) {
                state.dataList.splice(payload, 1)
            } else {
                state.dataList = []
            }
            storage.set("dataList", JSON.stringify(state.dataList))
        }

    },
    // Action 提交的是 mutation，而不是直接变更状态。
    // Action 可以包含任意异步操作。
    actions: {

    },
    // 可以认为是 store 的计算属性
    getters: {}
}

export default dataModule
