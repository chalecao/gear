import store from '../service/vuexService'
// import Vue from 'vue'
import Factory from '../models/factory'
import storage from '../service/localstorage'
const viewportModule = {
    state: {
        scale: 1,
        width: 1920,
        height: 1080,
        background: '#fff',
        mode: 'web',
        elementList: [],
        panelList: [],
        ckid: 0
    },
    mutations: {
        SetViewport(state, payload) {
            state.width = payload.width
            state.height = payload.height
        },
        SetScale(state, payload) {
            state.scale = payload
        },
        SetViewportCurrentById(state, payload) {
            state.ckid = payload
            let ele = state.elementList.find((k) => {
                return k.other.kid == payload
            })
            ele && store.dispatch('SetPropertyData', ele).then()
        },
        SetMode(state, payload) {
            state.mode = payload
        },

        SetScale(state, payload) {
            state.scale = parseFloat(payload).toFixed(1)
        },
        ZoomIn(state, payload) {
            state.scale = (parseFloat(state.scale) + 0.1).toFixed(1)
        },
        ZoomOut(state, payload) {
            state.scale = (parseFloat(state.scale) - 0.1).toFixed(1)
        },
        SetBackground(state, payload) {
            state.background = payload
        },
        CleanViewport(state, payload) {
            state.elementList = []
        },
        RefreshViewport(state, payload) {
            // window.viewport.$forceUpdate();
        },
        DelViewportElementByKid(state, payload) {
            if (payload) {
                // 清空当前元素kid
                if (state.ckid == payload) {
                    state.ckid = 0
                }
                let index = -1;
                state.elementList.find((a, i) => {
                    index = i
                    return a.other.kid == payload
                })

                if (index >= 0) {
                    state.elementList.forEach((a, i) => {
                        if (a.other.pkid == payload) {
                            a.other.pkid = ""
                        }
                    })
                    state.elementList.splice(index, 1)
                }
            }
        },
        CreateComponentOnViewport(state, payload) {
            payload.other = {}
            payload.special = {}
            payload.special.compName = payload.compName
            payload.other.type = payload.type
            let element = new Factory(payload).creatElement()
            if (element) {
                if (state.ckid) {
                    element.other.pkid = state.ckid
                }
                store.dispatch('SetPropertyData', element).then()
                store.dispatch('AddElement', element).then()
            }
        },
        CreateElementOnViewport(state, payload) {
            payload.other = {}
            payload.special = {}

            if (payload.type == "radio" || payload.type == "checkbox") {
                payload.other.type = "input"
                payload.special.type = payload.type
            } else {
                payload.other.type = payload.type
            }
            if (payload.type == "pool") {
                payload.other.ele = payload.ele
                let _data = eval('(' + payload.data + ')')
                for (let attr in _data) {
                    payload.special[attr + "_attr"] = _data[attr]
                }
            }

            let element = new Factory(payload).creatElement()
            if (element) {
                if (state.ckid) {
                    element.other.pkid = state.ckid
                }
                store.dispatch('SetPropertyData', element).then()
                store.dispatch('AddElement', element).then()
            }
        },
        AddElementOnViewport(state, payload) {
            let b, c;
            state.elementList = []
            payload.order.forEach(a => {
                b = payload.list.find((k) => {
                    return k.other.kid == a.kid
                })
                if (b) {
                    b.$children = a.children;
                    state.elementList.push(b)
                }
            })

        },
        SaveLocalStorage(state, payload) {
            if (!window.saveAs) {
                return;
            }
            let blob = new Blob([JSON.stringify(payload, null, 2)], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(blob, "gear_storage.gear");
        },
        ImportLocalStorage(state, payload) {
            let _list = payload
            if (typeof payload == "string") {
                _list = JSON.parse(_list)
            }
            Object.keys(_list).forEach((i) => {
                storage.set(i, _list[i])
            })
            location.reload()
        },
        SetPanelList(state, payload) {
            state.panelList = payload
        }
    },
    // Action 提交的是 mutation，而不是直接变更状态。
    // Action 可以包含任意异步操作。
    actions: {
        Refresh({
            commit
        }, data) {
            commit('RefreshViewport', data)
        },
        SaveAs({
            commit
        }, data) {
            commit('SaveLocalStorage', JSON.stringify(localStorage))
        },
        ImportData({
            commit
        }, data) {
            commit('ImportLocalStorage', data)
        }
    },
    // 可以认为是 store 的计算属性
    getters: {}
}

export default viewportModule
