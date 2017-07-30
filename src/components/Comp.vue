<template>
    <div class='comp'>
        <BSKElement v-if="!item.other.pkid" v-for="item in elementList" :listeners="computeListener(item)" :key="item.other.kid"
            :ele="item">
        </BSKElement>
    </div>
</template>

<script>
    import Vue from 'vue'
    import _ from 'lodash'
    import BSKElement from './Element'
    import Factory from '@/models/factory'
    import storage from '@/service/localstorage'
    import util from '@/service/util'
    export default {
        name: 'comp',
        props: ['ele'],
        data() {
            return {
                elementList: []
            }
        },
        mounted() {
            this.$nextTick(function () { // 保证 this.$el 已经插入文档
                if (this.ele.special.compName) {
                    let comp = storage.get(this.ele.special.compName);
                    JSON.parse(comp)["elements"].forEach(a => {
                        this.elementList.push(new Factory(a).creatElement());
                    })
                    let _orderEle = util.orderElement(this.elementList)
                    let b, c;
                    let _orderElementList = []
                    _orderEle.orderData.forEach(a => {
                        b = this.elementList.find((k) => {
                            return k.other.kid == a.kid
                        })
                        if (b) {
                            b.$children = a.children;
                            _orderElementList.push(b)
                        }
                    })

                    this.$watch('elementList', _.debounce(function (newValue, oldValue) {
                        console.log("elementList --- change")
                        this.updateElements(_orderElementList);
                    }.bind(this), 200), {
                        deep: true
                    })
                    this.updateElements(_orderElementList);

                    //同步programTxt到comp元素
                    this.ele.other.programTxt = ""
                    this.elementList.forEach(a => {
                        if (a.other.programTxt) {
                            a.other.programTxt.split(";").forEach((i) => {
                                this.ele.special[a.other.kid + "_" + i.split(".").join("-")] =
                                    ""
                                this.ele.other.programTxt += ("special." + a.other.kid + "_" +
                                    i.split(".")
                                    .join("-") +
                                    ";")
                            })

                        }
                    })
                }

                //监控ele变化，同步属性
                this.$watch('ele', _.debounce(function (newValue, oldValue) {
                    console.log('ele.special change')
                    Object.keys(this.ele.special).forEach((k) => {
                        if (k.match("_") && this.ele.special[k]) {
                            let _ele = this.elementList.find((i) => {
                                return i.other.kid == k.split("_")[0]
                            })
                            _ele[k.split("_")[1].split("-")[0]][k.split("_")[1].split("-")[
                                    1]] =
                                this.ele.special[k]
                        }
                    })
                }.bind(this), 400), {
                    deep: true
                })
            })
        },
        //注册组件
        components: {
            BSKElement
        },
        methods: {
            updateElements(_orderElementList) {
                _orderElementList.forEach((item, i) => {
                    if (item.other.pkid) {
                        console.log((item.other.pkid + i))
                        item.special.boxClassTxt = (item.other.pkid + i)
                        $("." + this.ele.other.kid + " ." + item.other.pkid + i).each(
                            function (i, mel) {
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
                                            }
                                        })
                                })
                            }.bind(this)
                        )
                    }
                })
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
            }
        }
    }

</script>
