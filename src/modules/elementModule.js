import Factory from '../models/factory'
import Meta from '../models/meta'
import SaveAs from 'filesaver'
import storage from '../service/localstorage'
import store from '../service/vuexService'
// import Vue from 'vue'
//处理刷新页面问题

const elementModule = {
    state: {
        name: storage.get("default-elementName") || "",
        type: storage.get("default-elementType") || "",
        operFlag: false,
        elementList: [],
        current: -1,
        ckid: 0,
        baseCurrent: 0,
        pageCurrent: 0,
        commonCurrent: 0,
        poolCurrent: 0,
        poolElementList: [],
        pageElementList: [],
        baseElementList: [{
            icon: 'glyphicon-th-large',
            type: 'element',
            name: '元素'
        }, {
            icon: 'glyphicon-text-width',
            type: 'text',
            name: '文本'
        }, {
            icon: 'glyphicon-picture',
            type: 'image',
            name: '图片'
        }, {
            icon: 'glyphicon-edit',
            type: 'input',
            name: '输入'
        }, {
            icon: 'glyphicon-record',
            type: 'radio',
            name: '单选'
        }, {
            icon: 'glyphicon-check',
            type: 'checkbox',
            name: '多选'
        }, {
            icon: 'glyphicon-th-list',
            type: 'select',
            name: '下拉'
        }, {
            icon: 'glyphicon-th-list',
            type: 'hover',
            name: '覆盖'
        }, {
            icon: 'glyphicon-gbp',
            type: 'func',
            name: '函数'
        }, {
            icon: 'glyphicon-transfer',
            type: 'cache',
            name: '请求'
        }, {
            icon: 'glyphicon-compressed',
            type: 'action',
            name: '操作'
        }, {
            icon: 'glyphicon-compressed',
            type: 'iframe',
            name: '内嵌'
        }]
    },
    mutations: {
        CleanElement(state, payload) {
            state.elementList = []
        },
        SetElementList(state, payload) {
            state.elementList = []
            payload && payload.elementList.forEach(a => {
                state.elementList.push(new Factory(a).creatElement());
            })
        },
        SetElementEdit(state, payload) {
            state.name = payload.name;
            state.type = payload.type;
            storage.set("default-elementName", payload.name)
            storage.set("default-elementType", payload.type)
        },
        SaveElementsModel(state) {

            let page = Object.assign(Meta.page, {
                "elements": []
            });
            state.elementList.forEach((el) => {
                page.elements.push(el.toJson())
            })

            console.log("save----" + state.name)
            if (state.name) {
                storage.set(state.name + "-element", JSON.stringify(page, null, 2))
            } else {
                storage.set("element-backup", JSON.stringify(page, null, 2))
            }

        },
        AddElement(state, payload) {
            payload && state.elementList.push(payload);
        },
        PasteElementByKid(state, payload) {
            if (payload) {
                let el = state.elementList.find((a, i) => {
                    return a.other.kid == payload
                })
                let element = new Factory(el).creatElement()
                element.other.kid = element.other.kid + (+new Date() + "").substr(-6)
                state.elementList.push(element);
            }
        },
        DelElementByKid(state, payload) {
            if (payload) {
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
        SetElementCurrent(state, payload) {
            state.current = payload.index
            state.ckid = payload.ckid
        },
        SetElementCurrentByKid(state, payload) {
            state.ckid = payload
            let index = state.current;
            state.elementList.find((k, i) => {
                index = i
                return k.other.kid == payload
            })
            state.current = index
        },
        SetBaseElementCurrent(state, payload) {
            state.baseCurrent = payload
        },
        SetPageElementCurrent(state, payload) {
            state.pageCurrent = payload
        },
        AddComponentOnViewport(state, payload) {
            let comp = storage.get(state.name.split("_")[0] + "_" + payload.name + "-element");
            if (comp) {
                JSON.parse(comp)["elements"].forEach(a => {
                    console.log("a.other.pkid---" + a.other.pkid + "--" + state.ckid)
                    debugger
                    if (!a.other.pkid && state.ckid) {
                        a.other.pkid = state.ckid
                    }
                    state.elementList.push(new Factory(a).creatElement());
                })
            }
        },
        SetCommonElementCurrent(state, payload) {
            state.commonCurrent = payload
        },
        SetPageElementList(state, payload) {
            state.pageElementList = payload
        },
        SetPoolElementCurrent(state, payload) {
            state.poolCurrent = payload
        },
        SetPoolElementList(state, payload) {
            state.poolElementList = payload
        },
        InitPoolElementList(state, payload) {
            let componentList = JSON.parse(storage.get("poolComponentList") || "[]")
            state.poolElementList = componentList.filter((e) => {
                return e.type == "component"
            })
        }
    },
    // Action 提交的是 mutation，而不是直接变更状态。
    // Action 可以包含任意异步操作。
    actions: {
        AddElement: ({
            commit
        }, data) => commit('AddElement', data),
        SetElementCurrent: ({
            commit
        }, data) => commit('SetElementCurrent', data),
        SetPageElementList: ({
            commit
        }, data) => commit('SetPageElementList', data),
        InitElementList: ({
            commit
        }, data) => {
            let default_elementName = storage.get("default-elementName")
            if (default_elementName) {
                let default_elementL = default_elementName && JSON.parse(storage.get(default_elementName + "-element"))
                let default_elementList = (default_elementL && default_elementL["elements"]) || []
                commit('SetElementList', {
                    elementList: default_elementList
                })
            } else if (!data) {
                //页面没有name时，数据从备份中取
                commit('SetElementList', {
                    elementList: JSON.parse(storage.get("element-backup"))["elements"] || []
                })
            } else {
                commit('SetElementList', {
                    elementList: []
                })
            }
        }
    },
    // 可以认为是 store 的计算属性
    getters: {}
}

export default elementModule
