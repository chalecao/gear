<template>
    <div class="project" @contextmenu="handleContextMenu" @click="clearSelect">
        <list :listData="projectList" :current="current" @contextmenu="handleContextMenu" @click="handleClick" @dblclick="handleDblclick"></list>
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
    import List from '@/components/List'
    import infoUtil from '@/service/infoUtil'
    import storage from '@/service/localstorage'
    export default {
        name: 'project-view',
        data() {
            return {}
        },
        computed: {
            ...mapState({
                current: state => state.project.current,
                projectList: state => state.project.projectList
            })
        },
        components: {
            List
        },
        mounted() {
            this.$nextTick(function () { // 保证 this.$el 已经插入文档
                this.InitProjectList()

                this.$watch('projectList', _.debounce(function (newValue, oldValue) {
                    this.SetPanelList(this.computeProjectList(this.projectList))
                }.bind(this), 200))
                this.SetPanelList(this.computeProjectList(this.projectList))
            })
        },
        destroyed() {
            this.SetPanelList([])
        },
        methods: {
            computeProjectList() {
                let _list = [];
                this.projectList.forEach((p) => {
                    _list.push(p)
                    let _p = storage.get(p.name + "-pageList");
                    if (_p) {
                        JSON.parse(_p).forEach((a) => {
                            a.parent = p.name
                            _list.push(a)
                        })
                    }
                });
                return _list;
            },
            handleContextMenu(e, item, index) {
                let _listData = [{
                    text: "新建",
                    type: "item",
                    handleClick: function () {
                        this.makeNewProjectItem()
                    }.bind(this)
                }];
                if (item) {
                    _listData.push({
                        text: "编辑",
                        type: "item",
                        handleClick: function () {
                            this.makeNewProjectItem(item, index)
                        }.bind(this)
                    });
                    _listData.push({
                        text: "删除",
                        type: "item",
                        handleClick: function () {
                            this.delProjectItem(index)
                        }.bind(this)
                    });
                }
                _listData.push({
                    text: "保存",
                    type: "item",
                    handleClick: function () {
                        this.UpdateProject(JSON.stringify(this.projectList))
                    }.bind(this)
                });
                infoUtil.contextMenu(e, _listData)
            },
            delProjectItem(index) {
                this.projectList.splice(index, 1)
                this.UpdateProject(JSON.stringify(this.projectList))
            },
            makeNewProjectItem(item, index) {
                var that = this;
                infoUtil.confirm({
                    title: item ? "编辑项目" : "创建项目",
                    okTxt: "确定",
                    cancelTxt: "取消",
                    listData: [{
                        label: "名称",
                        type: "input",
                        value: item && item.name || "",
                        key: "name",
                        tip: "项目名称，请使用英文字母"
                    }, {
                        label: "URL",
                        type: "input",
                        value: item && item.url || "",
                        key: "name",
                        tip: "该页面对应的URL地址"
                    }, {
                        label: "描述",
                        type: "input",
                        value: item && item.desc || "",
                        key: "desc",
                        tip: "简单介绍项目功能，每个项目是一个SPA或SP"
                    }]
                }, function (data) {
                    if (item) {
                        item = {
                            "desc": data[2].value,
                            "url": data[1].value,
                            "name": data[0].value,
                            "thumbnail": ""
                        }
                        that.projectList.splice(index, 1, item)
                    } else {
                        that.projectList.push({
                            "desc": data[2].value,
                            "url": data[1].value,
                            "name": data[0].value,
                            "thumbnail": ""
                        })
                    }
                    that.UpdateProject(JSON.stringify(that.projectList))
                })
            },
            ...mapActions(['InitDataList']),
            handleDblclick(item, index) {
                this.SetProjectCurrent(index)
                this.GetPageModule(item)
                location.hash = '#/page/module'
            },
            handleClick(item, index) {
                this.SetProjectCurrent(index)
            },
            clearSelect() {
                infoUtil.clearContextMenu()
            },
            ...mapMutations(['SetPanelList']),
            ...mapMutations(['InitProjectList']),
            ...mapMutations(['AddProject']),
            ...mapMutations(['UpdateProject']),
            ...mapMutations(['SetProjectCurrent']),
            ...mapMutations(['GetPageModule'])
        }
    }

</script>
