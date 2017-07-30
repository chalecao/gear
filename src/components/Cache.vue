<template>
    <div>
        CACHE<br>{{ele.other.kid}}
    </div>
</template>

<script>
    export default {
        name: 'cache',
        props: ['ele'],
        mounted() {
            this.$nextTick(function () { // 保证 this.$el 已经插入文档
            })
        },
        methods: {}
    }

</script>
