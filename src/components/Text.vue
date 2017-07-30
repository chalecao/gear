<template>
    <a v-if="ele.special.targetUrl" :target="ele.special.target" :href="ele.special.targetUrl">
        <span v-on="listeners" v-if="ele.special.type.match(/^span$/)" :class="ele.special.classStr" :style="ele.getSpecialStyle()" v-html="ctext"></span>
        <h1 v-on="listeners" v-else-if="ele.special.type.match(/^h(\d)$/)[1]==1" :class="ele.special.classStr" :style="ele.getSpecialStyle()" v-html="ctext"></h1>
        <h2 v-on="listeners" v-else-if="ele.special.type.match(/^h(\d)$/)[1]==2" :class="ele.special.classStr" :style="ele.getSpecialStyle()" v-html="ctext"></h2>
        <h3 v-on="listeners" v-else-if="ele.special.type.match(/^h(\d)$/)[1]==3" :class="ele.special.classStr" :style="ele.getSpecialStyle()" v-html="ctext"></h3>
    </a>
    <span v-on="listeners" v-else-if="ele.special.type.match(/^span$/)" :class="ele.special.classStr" :style="ele.getSpecialStyle()"
        v-html="ctext"></span>
    <h1 v-on="listeners" v-else-if="ele.special.type.match(/^h(\d)$/)[1]==1" :class="ele.special.classStr" :style="ele.getSpecialStyle()"
        v-html="ctext"></h1>
    <h2 v-on="listeners" v-else-if="ele.special.type.match(/^h(\d)$/)[1]==2" :class="ele.special.classStr" :style="ele.getSpecialStyle()"
        v-html="ctext"></h2>
    <h3 v-on="listeners" v-else-if="ele.special.type.match(/^h(\d)$/)[1]==3" :class="ele.special.classStr" :style="ele.getSpecialStyle()"
        v-html="ctext"></h3>
</template>
<script>
    import util from '@/service/util'
    export default {
        name: 'text',
        props: ['ele', 'data', 'listeners'],
        data() {
            return {
                ctext: ""
            }
        },
        mounted() {
            this.$nextTick(function () { // 保证 this.$el 已经插入文档
                this.$watch('data', _.debounce(function (newValue, oldValue) {
                    this.computeCtext();
                }.bind(this), 500), {
                    deep: true
                })
                this.$watch('ele', _.debounce(function (newValue, oldValue) {
                    this.computeCtext();
                }.bind(this), 500), {
                    deep: true
                })
                this.computeCtext();
            })
        },
        methods: {
            computeCtext: function () {
                this.ctext = util.exp2value(this.ele.special.textTxt, this.data)
            }
        }
    }

</script>
