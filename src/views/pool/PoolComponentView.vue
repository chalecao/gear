<template>
    <div id="compList" @contextmenu="handleContextMenu" @click="clearSelect">
        <list :listData="compList" :current="current" @contextmenu="handleContextMenu" @click="handleClick" @dblclick="handleDblclick"></list>
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
        name: 'poll-component-view',
        computed: {
            ...mapState({
                current: state => state.poolComponent.current,
                compList: state => state.poolComponent.componentList
            })
        },
        components: {
            List
        },
        mounted() {
            if (!this.compList.length) {
                this.$nextTick(function () { // 保证 this.$el 已经插入文档
                    this.InitPoolComponentList()
                })
            }
        },
        methods: {
            handleClick(item, index) {
                this.SetPoolComponentCurrent(index)
            },
            handleDblclick(item, index) {
                this.SetPoolComponentCurrent(index)
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
                        this.UpdatePoolComponent(JSON.stringify(this.compList))
                    }.bind(this)
                });
                infoUtil.contextMenu(e, _listData)
            },
            clearSelect() {
                infoUtil.clearContextMenu()
            },
            delProjectItem(index) {
                this.compList.splice(index, 1)
                this.UpdatePoolComponent(JSON.stringify(this.compList))
            },
            ...mapMutations(['UpdatePoolComponent']),
            ...mapMutations(['InitPoolComponentList']),
            ...mapMutations(['SetPoolComponentCurrent'])
        }
    }

</script>
