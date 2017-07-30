<template>
    <div id="compList">
        &nbsp;&nbsp;to do generate Test Case!
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
        computed: mapGetters({
            compList: 'getListData',
            componentUrl: 'getComponentUrl'
        }),
        components: {
            List
        },
        mounted() {
            this.$nextTick(function () { // 保证 this.$el 已经插入文档
                // this.initComponentData()
            })
        },
        methods: {
            initComponentData() {
                this.componentUrl && this.InitDataList(this.componentUrl)
            },
            ...mapActions(['InitDataList']),
            handleCompDblclick(item) {}
        }
    }

</script>
