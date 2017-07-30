<template>
    <div>
        <div class="elementList" :style="eleStyle" @click="clearSelect" @contextmenu="handleContextMenu">
            <list :listData="elementList" :current="current" @click="handleClick" @dblclick="handleDblclick" @contextmenu="handleContextMenu"></list>
        </div>
        <div class="baseElements" :style="baseStyle">
            <h4 v-if="baseElementList.length">基本元素：</h4>
            <BtnList :listData="baseElementList" :current="baseCurrent" @click="handleBaseClick" @dblclick="handleBaseDblclick"></BtnList>
            <h4 v-if="pageElementList.length && type=='page'">页面组件：</h4>
            <BtnList v-if="pageElementList.length && type=='page'" :listData="pageElementList" :current="pageCurrent" @click="handlePageClick"
                @dblclick="handlePageDblclick"></BtnList>
            <h4 v-if="poolElementList.length">组件池元件：</h4>
            <BtnList :cls="'pool'" :listData="poolElementList" :current="poolCurrent" @click="handlePoolClick" @dblclick="handlePoolDblclick"></BtnList>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import {
        mapState,
        mapActions,
        mapMutations
    } from 'vuex'
    import List from '@/components/List'
    import ContextMenu from '@/components/ContextMenu'
    import BtnList from '@/components/BtnList'
    import util from '@/service/util'
    import urlRouter from '@/service/urlRouter'
    import infoUtil from '@/service/infoUtil'

    export default {
        name: 'element-view',
        data() {
            return {
                copyEleKid: "",
                vm: "",
                eleStyle: "",
                baseStyle: "",
                thumbnail: ""
            }
        },
        computed: {
            ...mapState({
                editMode: state => state.editMode,
                current: state => state.element.current,
                operFlag: state => state.element.operFlag,
                name: state => state.element.name,
                type: state => state.element.type,
                ckid: state => state.element.ckid,
                baseCurrent: state => state.element.baseCurrent,
                pageCurrent: state => state.element.pageCurrent,
                commomCurrent: state => state.element.commomCurrent,
                poolCurrent: state => state.element.poolCurrent,
                mainElement: state => state.element.mainElement,
                dataList: state => state.element.elementList,
                baseElementList: state => state.element.baseElementList,
                pageElementList: state => state.element.pageElementList,
                poolElementList: state => state.element.poolElementList,
                poolComponentUrl: state => state.poolComponent.defaultPoolComponentUrl
            }),
            elementList: function () {
                if (!this.dataList) {
                    return [];
                }
                let _orderEle = util.orderElement(this.dataList)
                this.AddElementOnViewport({
                    list: this.dataList,
                    order: _orderEle.orderData
                })
                return _orderEle.listData
            }

        },
        components: {
            List,
            BtnList
        },
        beforeCreate() {
            this.$nextTick(function () {
                debugger
                // if (!this.editMode) {
                urlRouter.init()
                if (urlRouter.currenPage) {
                    debugger
                    console.log(urlRouter.currenPage)
                    this.GetPageModule(urlRouter.currenPage)

                    let mainPage = urlRouter.getDefaultPage()

                    if (mainPage && !this.name.match(mainPage.name)) {
                        this.GET2SetElementList({
                            name: this.name.split("_")[0] + "_" + mainPage.name,
                            type: mainPage.type
                        })
                    }
                    //预览和渲染模式需要处理
                    if (!this.editMode) {
                        document.body.onhashchange = function () {
                            let mainPage = urlRouter.getDefaultPage()
                            if (mainPage && !this.name.match(mainPage.name)) {
                                this.GET2SetElementList({
                                    name: this.name.split("_")[0] + "_" + mainPage.name,
                                    type: mainPage.type
                                })
                            }
                        }.bind(this)
                    }
                }

                // }
            })
        },
        mounted() {
            this.$nextTick(function () { // 保证 this.$el 已经插入文档
                if (!this.dataList.length) {
                    this.InitElementList(this.name)
                }
                //窗口缩放时重新计算边栏高度
                this.computeStyle()
                $(window).resize(function () {
                    this.computeStyle()
                }.bind(this))
                //初始化组件池组件
                this.InitPoolElementList(this.name)
            })
            setInterval(function () {
                if (this.dataList && this.dataList.length && !this.editMode) {
                    this.SaveElementsModel()
                }
            }.bind(this), 60000)
        },
        destroyed() {
            if (this.dataList && this.dataList.length && !this.editMode) {
                this.SaveElementsModel()
            }
            this.CleanViewport()
            this.CleanProperty()
            this.CleanElement()
        },
        methods: {
            computeStyle() {
                this.eleStyle = {
                    'height': parseInt((window.document.body.scrollHeight - 74) / 3) + 'px'
                }
                this.baseStyle = {
                    'height': (window.document.body.scrollHeight - 74 - parseInt((window.document.body.scrollHeight -
                        74) / 3)) + 'px'
                }
            },
            handleContextMenu(e, item, index) {
                if (item) {
                    this.SetElementCurrent({
                        index: index,
                        ckid: item.kid
                    })
                }
                let _listData = [{
                        text: "粘贴",
                        type: "item",
                        handleClick: function () {
                            this.pasteElementByKid(this.copyEleKid)
                        }.bind(this)
                    }
                    // , {
                    //     text: "保存缩略图",
                    //     type: "item",
                    //     handleClick: function () {
                    //         $(".viewport").removeClass("mesh")
                    //         html2canvas($(".viewport")[0], {
                    //             onrendered: function (canvas) {
                    //                 this.thumbnail = canvas.toDataURL(
                    //                     "image/png")
                    //                 $(".viewport").addClass("mesh")
                    //             },
                    //             width: 300,
                    //             height: 300
                    //         });
                    //     }.bind(this)
                    // }
                ]
                if (item) {
                    _listData = [{
                        text: "复制",
                        type: "item",
                        handleClick: function () {
                            this.copyEleKid = item.kid
                        }.bind(this)
                    }, {
                        text: "粘贴",
                        type: "item",
                        handleClick: function () {
                            this.pasteElementByKid(this.copyEleKid)
                        }.bind(this)
                    }, {
                        text: "删除",
                        type: "item",
                        handleClick: function () {
                            this.delElementByKid(item.kid)
                        }.bind(this)
                    }]
                }
                _listData.push({
                    text: "清空",
                    type: "item",
                    handleClick: function () {
                        infoUtil.confirm({
                            title: "清空",
                            okTxt: "确定",
                            cancelTxt: "取消",
                            content: "确定要删除全部元素吗？"
                        }, function (data) {
                            this.SetElementList([])
                        }.bind(this))
                    }.bind(this)
                })
                _listData.push({
                    text: "保存",
                    type: "item",
                    handleClick: function () {
                        this.SaveElementsModel()
                    }.bind(this)
                })
                infoUtil.contextMenu(e, _listData)
            },
            ...mapActions(['InitElementList']),
            handleClick(item, index) {
                this.SetElementCurrent({
                    index: index,
                    ckid: item.kid
                })
                this.SetViewportCurrentById(item.kid)
            },
            handleDblclick(item, index) {

            },
            handleBaseClick(item, index) {
                this.SetBaseElementCurrent(index)
            },
            handleBaseDblclick(item, index) {
                this.CreateElementOnViewport(item)
            },
            handlePageClick(item, index) {
                this.SetPageElementCurrent(index)
            },
            handlePageDblclick(item, index) {
                this.CreateComponentOnViewport({
                    type: "comp",
                    compName: this.name.split("_")[0] + "_" + item.name + "-element"
                })
                // this.AddComponentOnViewport(item)
            },
            handlePoolClick(item, index) {
                this.SetPoolElementCurrent(index)
            },
            handlePoolDblclick(item, index) {
                this.CreateElementOnViewport(item)
            },
            delElementByKid(kid) {
                this.DelElementByKid(kid)
                this.DelViewportElementByKid(kid)
            },
            pasteElementByKid(kid) {
                this.PasteElementByKid(kid)
            },
            clearSelect(kid) {
                infoUtil.clearContextMenu()
                this.SetElementCurrentByKid(0)
                this.SetElementCurrent(-1)
                this.SetViewportCurrentById(0)
            },
            ...mapMutations(['CleanProperty']),
            ...mapMutations(['CleanViewport']),
            ...mapMutations(['CleanElement']),
            ...mapMutations(['SaveElementsModel']),
            ...mapMutations(['SetElementList']),
            ...mapMutations(['SetElementCurrent']),
            ...mapMutations(['SetElementCurrentByKid']),
            ...mapMutations(['SetBaseElementCurrent']),
            ...mapMutations(['AddComponentOnViewport']),
            ...mapMutations(['GetPageModule']),
            ...mapMutations(['SetPageElementCurrent']),
            ...mapMutations(['SetPoolElementCurrent']),
            ...mapMutations(['InitPoolElementList']),
            ...mapMutations(['CreateElementOnViewport']),
            ...mapMutations(['CreateComponentOnViewport']),
            ...mapMutations(['AddElementOnViewport']),
            ...mapMutations(['DelElementByKid']),
            ...mapMutations(['PasteElementByKid']),
            ...mapMutations(['DelViewportElementByKid']),
            ...mapMutations(['SetViewportCurrentById']),
            ...mapActions(['GET2SetElementList'])

        }
    }

</script>
