<template>
    <div>
        <input v-if="ele.special.type == 'radio'" type="radio" :style="ele.getSpecialStyle()" :class="ele.special.classStr" :name="cname"
            v-model="ele.$value" :placeholder="ele.special.placeHolder">
        <input v-if="ele.special.type == 'checkbox'" type="checkbox" :style="ele.getSpecialStyle()" :class="ele.special.classStr"
            :name="cname" v-model="ele.$value" :placeholder="ele.special.placeHolder">
        <input v-if="ele.special.type == 'text'" type="text" :style="ele.getSpecialStyle()" :class="ele.special.classStr" :name="cname"
            v-model="ele.$value" :placeholder="ele.special.placeHolder">
        <input v-if="ele.special.type == 'password'" type="password" :style="ele.getSpecialStyle()" :class="ele.special.classStr"
            :name="cname" v-model="ele.$value" :placeholder="ele.special.placeHolder">{{ele.special.desc}}</div>
</template>

<script>
    import util from '@/service/util'
    export default {
        name: 'input',
        props: ['ele', 'data'],
        data() {
            return {
                cname: ""
            }
        },
        computed: {},
        mounted() {
            this.$nextTick(function () { // 保证 this.$el 已经插入文档
                this.$watch('data', _.debounce(function (newValue, oldValue) {
                    this.computeCname();
                }.bind(this), 500), {
                    deep: true
                })
                this.$watch('ele', _.debounce(function (newValue, oldValue) {
                    this.computeCname();
                }.bind(this), 500), {
                    deep: true
                })
                this.computeCname();
            })
        },
        methods: {
            computeCname: function () {
                let _key = this.ele.special.name
                this.cname = util.exp2value(this.ele.special.name, this.data)
            }
        }
    }

</script>
