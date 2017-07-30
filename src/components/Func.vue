<template>
    <div v-if="ele.special.funcType == 'for'">
        <div v-for="it in itemList" :key="serialize(it)" class="f-dib">
            <slot name="item" :item="serialize(it)"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'func',
        props: ['ele'],
        computed: {
            itemList: function (item) {
                console.log(this.ele.special.listTxt)
                return JSON.parse(this.ele.special.listTxt);
            }
        },
        mounted() {
            this.$nextTick(function () { // 保证 this.$el 已经插入文档
            })
        },
        methods: {
            serialize: function (item) {
                return JSON.stringify(item)
            }
        }
    }

</script>
