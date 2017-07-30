// import store from '../service/vuexService'
import Vue from 'vue'
const listModule = {
    state: {
        listData: []

    },
    mutations: {
        InitDataList(state, payload) {
            state.listData = payload
        }

    },
    // Action 提交的是 mutation，而不是直接变更状态。
    // Action 可以包含任意异步操作。
    actions: {
        InitDataList({
            commit
        }, url) {
            Vue.http.get(url).then((response) => {
                let result = response.data
                if (result && result.length > 0) {
                    commit('InitDataList', typeof result === 'string' ? JSON.parse(result) : result)
                }
            }, (response) => {
                // error back coding...
            }).catch(function (response) {
                console.log(response)
            })
        }
    },
    // 可以认为是 store 的计算属性
    getters: {
        getListData: state => {
            return state.listData
        }
    }
}

export default listModule
