<template>
    <a v-if="ele.special.targetUrl" :target="ele.special.target" :href="ele.special.targetUrl" style='display:inline-block;width:100%;'>
        <img :class="ele.special.classStr" :src="csrc" :style="ele.getWH()+ele.getBorderRadius()">
    </a>
    <img v-else :class="ele.special.classStr" :src="csrc" :style="ele.getWH()+ele.getBorderRadius()">
</template>

<script>
    import util from '@/service/util'
    export default {
        name: 'image',
        props: ['ele', "data"],
        data() {
            return {
                csrc: ""
            }
        },
        mounted() {
            this.$nextTick(function () { // 保证 this.$el 已经插入文档
                this.$watch('data', _.debounce(function (newValue, oldValue) {
                    this.computeCsrc();
                }.bind(this), 500), {
                    deep: true
                })
                this.$watch('ele', _.debounce(function (newValue, oldValue) {
                    this.computeCsrc();
                }.bind(this), 500), {
                    deep: true
                })
                this.computeCsrc();
            })
        },
        methods: {
            computeCsrc: function () {
                this.csrc = util.exp2value(this.ele.special.src, this.data)
            }
        }
    }

</script>
