import storage from '../service/localstorage'

if (!storage.get("projectList")) {
    storage.set("projectList", "[]")
}
const projectModule = {
    state: {
        projectList: JSON.parse(storage.get("projectList")),
        current: 0
    },
    mutations: {
        SetProjectCurrent(state, payload) {
            state.current = payload
        },
        UpdateProject(state, payload) {
            storage.set("projectList", payload)
            state.projectList = JSON.parse(payload)
        },
        InitProjectList(state, payload) {
            state.projectList = JSON.parse(storage.get("projectList"))
        }
    },
    // Action 提交的是 mutation，而不是直接变更状态。
    // Action 可以包含任意异步操作。
    actions: {},
    // 可以认为是 store 的计算属性
    getters: {}
}

export default projectModule
