<template>
    <div id="compList">
        <list :listData="compList" :current="current" @click="handleClick" @dblclick="handleDblclick"></list>
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
    export default {
        name: 'tab-view',
        computed: {
            ...mapGetters({
                dataList: 'getListData',
                componentUrl: 'getComponentUrl'
            }),
            ...mapState({
                current: state => state.component.current,
                mainComponent: state => state.component.mainComponent
            }),
            compList: function () {
                let listData = []
                if (this.mainComponent) {
                    let root = this.dataList.find(a => {
                        return a.meta && a.meta.name == this.mainComponent
                    })
                    root && listData.push({
                        name: root.meta.name,
                        target: root
                    })
                    this.dataList.forEach(a => {
                        if (a.meta && a.meta.name != this.mainComponent) {
                            listData.push({
                                name: '- ' + a.meta.name,
                                target: a
                            })
                        }
                    })
                } else {
                    this.dataList.forEach(a => {
                        listData.push({
                            name: a.meta.name,
                            target: a
                        })
                    })
                }
                return listData
            }
        },
        components: {
            List
        },
        mounted() {
            this.$nextTick(function () { // 保证 this.$el 已经插入文档
                this.initComponentData()
            })
        },
        methods: {
            initComponentData() {
                this.componentUrl && this.InitDataList(this.componentUrl)
            },
            ...mapActions(['InitDataList']),
            handleClick(item, index) {
                this.SetComponentCurrent(index)
            },
            handleDblclick(item, index) {
                this.SetComponentCurrent(index)
                this.CleanViewport(index)
                this.SetElementList({
                    elementList: item.target && item.target.elements
                })
                location.hash = '#/page/element'
            },
            ...mapMutations(['SetComponentCurrent']),
            ...mapMutations(['CleanViewport']),
            ...mapMutations(['SetElementList'])
        }
    }

</script>
