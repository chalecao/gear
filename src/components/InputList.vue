<template>
    <div class="input-list">
        <div class="input-group" v-for="item in list">
            <span class="input-group-addon">{{item.label}}</span>
            <input v-if="item.key.substr(-3) != 'Txt'" type="text" class="form-control" v-model="ele[prop][item.key]" :title="item.key"
                :placeholder="item.key" @keydown.up="handlePlus(item)" @keydown.down="handleMinus(item)">
            <textarea v-if="item.key.substr(-3) == 'Txt'" type="text" class="form-control" v-model="ele[prop][item.key]" :title="item.key"
                :placeholder="item.key"></textarea>
            <span v-if="item.key == 'actionTxt'" title="add event" @click="ele.updateAction();" class="input-group-addon btn btn-danger">A</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'input-list',
        props: ['ele', 'prop'],
        computed: {
            list: function () {
                let l = [];
                for (var k in this.ele[this.prop]) {
                    l.push({
                        label: k[0],
                        key: k
                    });
                }
                return l
            }
        },
        mounted() {
            this.$nextTick(function () { // 保证 this.$el 已经插入文档
                this.$watch('ele.' + this.prop, _.debounce(function (newValue, oldValue) {
                    this.ele.update();
                }.bind(this), 400), {
                    deep: true
                })
            })
        },
        methods: {
            handlePlus: function (item) {
                if (!isNaN(+this.ele[this.prop][item.key])) {
                    this.ele[this.prop][item.key] += 1
                }
            },
            handleMinus: function (item) {
                if (!isNaN(+this.ele[this.prop][item.key])) {
                    this.ele[this.prop][item.key] -= 1
                }
            }
        }
    }

</script>
