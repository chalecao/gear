<template>
    <tab-panel :tabList="poolBarList"></tab-panel>
</template>

<script>
    import Vue from 'vue'
    import {
        mapState
    } from 'vuex'
    import TabPanel from '@/components/TabPanel'
    export default {
        name: 'tab-view',
        computed: {
            ...mapState(['poolBarList'])
        },
        components: {
            TabPanel
        }
    }

</script>
