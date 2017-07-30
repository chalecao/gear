<template>
    <div class="btn-group" :class="cls" role="group" >
        <button v-for="(item, i) in listData" @click="clickOnItem($event,item,i)" @dblclick="dbclickOnItem($event,item,i)" type="button"
            class="btn btn-default" :class="current== i?('btn-primary '+(item.cls||'')):(item.cls||'')">
            <span v-if="item.icon" class="glyphicon f-db" :class="item.icon"></span>
            <span>{{item.name}}</span>
        </button>
    </div>
</template>

<script>
    export default {
        name: 'btn-list',
        props: ['listData', 'current', 'cls'],
        methods: {
            contextmenuOnItem: function (e, item) {
                //  x: e.clientX y: e.clientY
            },
            dbclickOnItem: function (e, item, i) {
                this.$emit('dblclick', item, i)
            },
            clickOnItem: function (e, item, i) {
                this.$emit('click', item, i)
            }
        }
    }

</script>
