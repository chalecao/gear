import storage from '../service/localstorage'
let default_name = storage.get("default-pageName") || ""
let default_pkey = default_name + "-pageList"
let default_pageList = JSON.parse(storage.get(default_pkey) || "[]")

const moduleModule = {
    state: {
        current: 0,
        pkey: "",
        ckey: "",
        name: default_name,
        pageList: default_pageList
    },
    mutations: {
        GetPageModule(state, payload) {
            state.name = payload.name;
            storage.set("default-pageName", payload.name)
            state.pkey = payload.name + "-pageList"
            if (!storage.get(state.pkey)) {
                storage.set(state.pkey, "[]")
            }
            state.pageList = JSON.parse(storage.get(state.pkey))
        },
        SetPageCurrent(state, payload) {
            state.current = payload
        },
        UpdatePage(state, payload) {
            storage.set(state.pkey, payload)
            state.pageList = JSON.parse(payload)
        }
    },
    // Action 提交的是 mutation，而不是直接变更状态。
    // Action 可以包含任意异步操作。
    actions: {
        GET2SetElementList({
            commit
        }, item) {
            commit('SetElementEdit', item)
            let _eleList = JSON.parse(storage.get(item.name + "-element"))
            commit('SetElementList', {
                elementList: (_eleList && _eleList.elements) || []
            })
        },
        InitPageComponent({
            commit
        }, componentList) {
            commit('SetPageElementList', componentList)
        },
        InitCommonComponent({
            commit
        }, url) {
            Vue.http.post(url).then((response) => {
                let result = response.data
                result = (typeof result === 'string') ? JSON.parse(result) : result

                commit('SetPoolCompList', result.reduce((a, b) => {
                    return a.concat(b)
                }))

                commit('SetPoolElementList', result.reduce((a, b) => {
                    a[0].cls = "btn-danger f-cb";
                    b[0].cls = "btn-danger f-cb";
                    return a.concat(b)
                }))
            }, (response) => {
                console.log("组件池组件配置文件不存在！");
            }).catch(function (response) {
                console.log(response)
            })
        }
    },
    // 可以认为是 store 的计算属性
    getters: {}
}

export default moduleModule
