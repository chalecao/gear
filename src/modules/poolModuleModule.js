import storage from '../service/localstorage'
const poolModuleModule = {
    state: {
        current: 0,
        pageList: []
    },
    mutations: {
        SetPoolModuleCurrent(state, payload) {
            state.current = payload
        },
        UpdatePoolModule(state, payload) {
            storage.set("poolModuleList", payload)
            state.pageList = JSON.parse(payload)
        },
        AddPoolModule(state, payload) {
            state.pageList.push(payload)
            storage.set("poolModuleList", JSON.stringify(state.pageList))
        },
        InitPoolModuleList(state, payload) {
            state.pageList = JSON.parse(storage.get("poolModuleList") || "[]")
        }
    },
    // Action 提交的是 mutation，而不是直接变更状态。
    // Action 可以包含任意异步操作。
    actions: {},
    // 可以认为是 store 的计算属性
    getters: {}
}

export default poolModuleModule
