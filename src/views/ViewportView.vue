<template>
    <div v-if="elementL.length" class='viewport mesh' :style='viewStyle'>
        <BSKElement v-if="!item.other.pkid" v-for="item in elementL" :listeners="computeListener(item)" :ckid="ckid" :key="serialize(item)"
            :ele="item" @click="setCurrentKid">
        </BSKElement>
    </div>
    <div class='viewport' :style='viewStyle' v-else>
        <BSKPanel v-for="item in panelList" :ele="item" :key="item.name"></BSKPanel>
    </div>
</template>

<script>
    import Vue from 'vue'
    import _ from 'lodash'
    import {
        mapState,
        mapMutations
    } from 'vuex'
    import BSKElement from '@/components/Element'
    import BSKPanel from '@/components/Panel'
    import util from '@/service/util'

    export default {
        name: 'viewport',
        computed: {
            ...mapState({
                scale: state => state.viewport.scale,
                ckid: state => state.viewport.ckid,
                width: state => state.viewport.width,
                height: state => state.viewport.height,
                background: state => state.viewport.background,
                elementList: state => state.viewport.elementList,
                panelList: state => state.viewport.panelList,
                editMode: state => state.editMode
            }),
            elementL: function () {
                //注意上面v-for用在自定义元素的时候，需要设定key，key发生变化的时候才会从新渲染，这个规则和比较需要深究，现在设置的是elementList,当列表发生变化就会从新渲染
                return this.elementList
            },
            viewStyle: function () {
                if (this.editMode) {
                    let val = this.scale
                    return {
                        'width': this.width + 'px',
                        'height': this.height + 'px',
                        'background-color': this.background,
                        '-webkit-transform': 'scale(' + val + ',' + val + ')',
                        '-moz-transform': 'scale(' + val + ',' + val + ')',
                        '-o-transform': 'scale(' + val + ',' + val + ')',
                        'transform': 'scale(' + val + ',' + val + ')'
                    }
                } else {
                    return ""
                }
            }
        },
        mounted() {
            this.$nextTick(function () { // 保证 this.$el 已经插入文档
                this.$watch('elementList', _.debounce(function (newValue, oldValue) {
                        console.log('元素属性发生变化，需要重新绘制')
                        this.elementList.forEach((item, i) => {
                            if (item.other.pkid) {
                                console.log("---" + item.other.pkid + i)
                                $("." + item.other.pkid + i).each(function (i, mel) {
                                    new Vue({
                                        el: mel,
                                        render: createElement => createElement(
                                            BSKElement, {
                                                props: {
                                                    ele: item,
                                                    ckid: this.ckid,
                                                    data: $(mel).attr(
                                                        "data"),
                                                    listeners: this.computeListener(
                                                        item, $(mel).attr(
                                                            "data")
                                                    )
                                                },
                                                on: {
                                                    click: this.setCurrentKid
                                                }
                                            })
                                    })
                                }.bind(this))
                            }
                        })
                    }.bind(this),
                    200), {
                    deep: true
                })
            })
        },
        //注册组件
        components: {
            BSKElement,
            BSKPanel
        },
        methods: {
            serialize(item){
                return JSON.stringify(item)
            },
            computeListener(ele, _value) {
                if (!Object.keys(ele.evt).length) {
                    return {}
                }
                let listeners = {}
                for (var e in ele.evt) {
                    if (ele.evt[e]) {
                        let _e = ele.evt[e].split(">")[0]
                        let _cb = ele.evt[e].split(">")[1]
                        let _func = _e.split("(")[0]
                        let _paramList = _e.split("(")[1] && _e.split("(")[1].split(")")[0].split(",")
                        let _oper = {},
                            _cbE = {},
                            _param = {},
                            _paramE = {};
                        listeners[e] = function () {
                            _oper = this.elementList.find((i) => {
                                return i.other.kid == _func
                            })
                            _paramList && _paramList.forEach((_pa) => {
                                if (_pa.substr(0, 1) == ":") {
                                    //如果 指定参数是自身的属性 :termId-data:termId
                                    let _k = _pa.substr(1).split("-");

                                    if (_value) {
                                        _param[_k[0]] = util.exp2value(_k[1], _value)
                                    }
                                } else if (_pa) {
                                    //如果 指定参数是页面中的一个元素
                                    _paramE = this.elementList.find((i) => {
                                        return i.other.kid == _pa
                                    })
                                    _param[_paramE.special.name || "default"] = _paramE.$value
                                } else if (_oper.other.param) {
                                    //默认去param参数
                                    _param = _oper.other.param
                                }
                            })
                            //如果有回掉函数
                            if (_cb) {
                                let cbList = _cb.split(">")
                                let cl = cbList.length
                                if (cl > 1) {
                                    _cb = cbList[cl - 1]
                                }
                                _cb = _cb.replace(/ /g, "")
                                _cbE = this.elementList.find((i) => {
                                    return i.other.kid == _cb
                                })

                                _cbE && _oper && _oper.handle(_param, function (data) {
                                    if (cl > 1) {
                                        cbList = cbList.splice(cl - 2, 1)
                                        cbList.forEach((c) => {
                                            let _c = this.elementList.find((i) => {
                                                return i.other.kid == c
                                            })
                                            _c.handle()
                                        })
                                    }
                                    if (_cbE.other.type == "action") {
                                        _cbE.handle()
                                    } else {
                                        _cbE.other.programTxt.split(";").forEach((i) => {
                                            if (i) {
                                                _cbE[i.split(".")[0]][i.split(".")[1]] = JSON.stringify(
                                                    data[i.split(
                                                        ".")[1]])
                                            }
                                        })
                                    }

                                })
                            } else {
                                _oper && _oper.handle(_param)
                            }
                        }.bind(this)
                        if (e == "init") {
                            listeners[e]();
                        }
                    }
                }
                return listeners
            },
            setCurrentKid(kid) {
                this.SetViewportCurrentById(kid)
                this.SetElementCurrentByKid(kid)
            },
            ...mapMutations(['SetViewportCurrentById']),
            ...mapMutations(['SetElementCurrentByKid'])
        },
    }

</script>
