<template>
    <div class="list-group">
        <a v-for="(item, index) in listData" @click="clickOnItem($event,item,index)" @dblclick="dbclickOnItem($event,item,index)"
            @contextmenu="contextmenuOnItem($event,item,index)" class="list-group-item" :class="index == current?'active':''">
            <h4 v-if="item.name" class="list-group-item-heading">{{item.name}}</h4>
            <p v-if="item.desc" class="list-group-item-text"> - {{item.desc}}</p>
            <img v-if="item.thumbnail" :src="item.thumbnail" class="thumbnail">
            <span v-if="item.type" class="tip">{{item.type}}</span>
            <span v-if="item.url" class="tip">{{item.url}}</span>
        </a>
    </div>
</template>

<script>
    export default {
        name: 'list',
        props: ['listData', 'current'],
        methods: {
            contextmenuOnItem: function (e, item, index) {
                //  x: e.clientX y: e.clientY
                this.$emit('contextmenu', e, item, index)
                e.preventDefault();
                e.stopPropagation();

            },
            dbclickOnItem: function (e, item, index) {
                this.$emit('dblclick', item, index)
                e.preventDefault();
                e.stopPropagation();
            },
            clickOnItem: function (e, item, index) {
                this.$emit('click', item, index)
                e.preventDefault();
                e.stopPropagation();
            }
        }
    }

</script>
