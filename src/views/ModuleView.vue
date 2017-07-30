<template>
    <div id="pageList" @click="clearSelect" @contextmenu="handleContextMenu">
        <list @contextmenu="handleContextMenu" :listData="pageList" :current="current" @click="handleClick" @dblclick="handleDblclick"></list>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {
        mapState,
        mapGetters,
        mapActions,
        mapMutations
    } from 'vuex'
    import infoUtil from '@/service/infoUtil'
    import List from '@/components/List'
    import urlRouter from '@/service/urlRouter'
    export default {
        name: 'tab-view',
        data() {
            return {
                vm: ""
            }
        },
        computed: {
            ...mapState({
                name: state => state.module.name,
                current: state => state.module.current,
                pageList: state => state.module.pageList
            }),
        },
        components: {
            List
        },
        mounted() {
            this.$nextTick(function () { // 保证 this.$el 已经插入文档
                let componentList = this.pageList.filter((e) => {
                    return e.type == "component"
                })
                this.InitPageComponent(componentList)
            })
        },
        methods: {
            handleContextMenu(e, item, index) {
                if (index >= 0)
                    this.SetPageCurrent(index)
                let _listData = [{
                    text: "新建",
                    type: "item",
                    handleClick: function () {
                        this.makeNewPageItem()
                    }.bind(this)
                }];
                if (item) {
                    _listData.push({
                        text: "编辑",
                        type: "item",
                        handleClick: function () {
                            this.makeNewPageItem(item, index)
                        }.bind(this)
                    });
                    _listData.push({
                        text: item.type == 'component' ? "添加到组件池" : "添加到页面池",
                        type: "item",
                        handleClick: function () {
                            //存放的目的元素
                            item.targetKey = this.name + "_" + item.name;
                            if (item.type == 'component') {
                                this.AddPoolComponent(item, )
                            } else {
                                this.AddPoolModule(item)
                            }
                        }.bind(this)
                    });
                    _listData.push({
                        text: "删除",
                        type: "item",
                        handleClick: function () {
                            this.delPageItem(index)
                        }.bind(this)
                    });
                }
                _listData.push({
                    text: "保存",
                    type: "item",
                    handleClick: function () {
                        this.UpdatePage(JSON.stringify(this.pageList))
                    }.bind(this)
                });
                infoUtil.contextMenu(e, _listData)

            },
            clearSelect() {
                infoUtil.clearContextMenu()
            },
            delPageItem(index) {
                this.pageList.splice(index, 1)
                this.UpdatePage(JSON.stringify(this.pageList))
            },
            makeNewPageItem(item, index) {
                var that = this;
                infoUtil.confirm({
                    title: item ? "编辑页面或组件" : "创建页面或组件",
                    okTxt: "确定",
                    cancelTxt: "取消",
                    listData: [{
                        label: "名称",
                        type: "input",
                        value: item && item.name || "",
                        key: "name",
                        tip: "页面或组件名称，请使用英文字母"
                    }, {
                        label: "描述",
                        type: "input",
                        value: item && item.desc || "",
                        key: "desc",
                        tip: "简单介绍页面功能"
                    }, {
                        label: "类型",
                        type: "input",
                        value: item && item.type || "",
                        key: "type",
                        tip: "page或component，component可以被引用，page不行"
                    }]
                }, function (data) {
                    if (item) {
                        item = {
                            "desc": data[1].value,
                            "name": data[0].value,
                            "type": data[2].value,
                            "thumbnail": ""
                        }
                        that.pageList.splice(index, 1, item)
                    } else {
                        that.pageList.push({
                            "desc": data[1].value,
                            "name": data[0].value,
                            "type": data[2].value,
                            "thumbnail": ""
                        })
                    }
                    that.UpdatePage(JSON.stringify(that.pageList))
                })
            },
            ...mapActions(['InitDataList']),
            ...mapActions(['SaveAs']),
            handleDblclick(item, index) {
                this.SetPageCurrent(index)
                this.GET2SetElementList({
                    name: this.name + "_" + item.name,
                    type: item.type
                })
                location.hash = '#/page/element'
            },
            handleClick(item, index) {
                infoUtil.clearContextMenu()
                this.SetPageCurrent(index)
            },

            ...mapMutations(['AddPoolComponent']),
            ...mapMutations(['AddPoolModule']),
            ...mapMutations(['UpdatePage']),
            ...mapActions(['GET2SetElementList']),
            ...mapActions(['InitPageComponent']),
            ...mapMutations(['SetPageCurrent']),
            ...mapMutations(['GetPageModule'])
        }
    }

</script>
