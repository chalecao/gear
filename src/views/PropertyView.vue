<template>
    <div class="propertyContainer" v-if="el">

        <!-- Nav tabs -->
        <ul class="nav nav-tabs" role="tablist">
            <li role="presentation" class="active"><a href="#position" role="tab" data-toggle="tab">位置</a></li>
            <li role="presentation"><a href="#show" role="tab" data-toggle="tab">展示</a></li>
            <li role="presentation"><a href="#special" role="tab" data-toggle="tab">特性</a></li>
            <li role="presentation"><a href="#other" role="tab" data-toggle="tab">其他</a></li>
        </ul>

        <!-- Tab panes -->
        <div class="tab-content">
            <div role="tabpanel" class="tab-pane active" id="position">
                <InputList :ele="el" :prop="'position'"></InputList>
            </div>
            <div role="tabpanel" class="tab-pane" id="show">
                <InputList :ele="el" :prop="'show'"></InputList>
            </div>
            <div role="tabpanel" class="tab-pane" id="special">
                <InputList :ele="el" :prop="'special'"></InputList>
            </div>
            <div role="tabpanel" class="tab-pane" id="other">
                <InputList :ele="el" :prop="'other'"></InputList>
            </div>
        </div>

    </div>
</template>

<script>
    import Vue from 'vue'
    import {
        mapState,
        mapMutations
    } from 'vuex'
    import InputList from '@/components/InputList'

    export default {
        name: 'tab-view',
        computed: {
            ...mapState({
                el: state => state.property.el
            })
        },
        components: {
            InputList
        },
        methods: {

        }
    }

</script>
