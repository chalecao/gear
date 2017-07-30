import storage from '../service/localstorage'
const poolComponentModule = {
    state: {
        current: 0,
        componentList: []
    },
    mutations: {
        SetPoolComponentCurrent(state, payload) {
            state.current = payload
        },
        UpdatePoolComponent(state, payload) {
            storage.set("poolComponentList", payload)
            state.componentList = JSON.parse(payload)
        },
        AddPoolComponent(state, payload) {
            state.componentList.push(payload)
            storage.set("poolComponentList", JSON.stringify(state.componentList))
        },
        InitPoolComponentList(state, payload) {
            state.componentList = JSON.parse(storage.get("poolComponentList") || "[]")
        }
    },
    // Action 提交的是 mutation，而不是直接变更状态。
    // Action 可以包含任意异步操作。
    actions: {}
}

export default poolComponentModule
