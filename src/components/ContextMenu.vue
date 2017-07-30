<template>
    <div class="context-menu" :style="'left:'+x+'px;top:'+y+'px;'">
        <ul>
            <li v-for="item in listData" :class="{disabled:item.disabled,divide:item.type=='divide','list-item':item.type!=='divide'}"
                @click="handleClick(item)">
                {{item.text}}
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: ['listData', "x", "y"],
        methods: {
            handleClick: function (item) {
                item.handleClick()
                this.$emit('click')
            }
        }
    }

</script>
