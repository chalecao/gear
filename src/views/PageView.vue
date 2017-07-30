<template>
    <tab-panel :tabList="pageBarList"></tab-panel>
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
            ...mapState(['pageBarList'])
        },
        components: {
            TabPanel
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h1,
    h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }

</style>
