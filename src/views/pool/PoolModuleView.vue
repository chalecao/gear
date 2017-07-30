<template>
    <div id="pageList" @contextmenu="handleContextMenu" @click="clearSelect">
        <list :listData="pageList" :current="current" @contextmenu="handleContextMenu" @click="handleClick" @dblclick="handleDblclick"></list>
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
    export default {
        name: 'pool-module-view',
        computed: {
            ...mapState({
                current: state => state.poolModule.current,
                pageList: state => state.poolModule.pageList
            })
        },
        components: {
            List
        },
        mounted() {
            this.$nextTick(function () { // 保证 this.$el 已经插入文档
                this.InitPoolModuleList()
            })
        },
        methods: {

            handleDblclick(item, index) {
                this.SetPoolModuleCurrent(index)
            },
            handleClick(item, index) {
                this.SetPoolModuleCurrent(index)
            },
            handleContextMenu(e, item, index) {
                let _listData = [];
                if (item) {
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
                        this.UpdatePoolModule(JSON.stringify(this.pageList))
                    }.bind(this)
                });
                infoUtil.contextMenu(e, _listData)
            },
            clearSelect() {
                infoUtil.clearContextMenu()
            },
            delProjectItem(index) {
                this.pageList.splice(index, 1)
                this.UpdatePoolModule(JSON.stringify(this.pageList))
            },
            ...mapMutations(['UpdatePoolModule']),
            ...mapMutations(['InitPoolModuleList']),
            ...mapMutations(['SetPoolModuleCurrent'])
        }
    }

</script>
