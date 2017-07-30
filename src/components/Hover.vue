<template>
    <div class="e-hover-target" v-if="ele.show.hover && ele.show.hover != 'code' " :class="ele.show.hover">
        <div class="e-hover-arrow"></div>
        <div class="e-hover-arrow-border"></div>
        <div class="e-hover-content">
            <slot></slot>
        </div>
    </div>
    <div class="e-hover-code" v-else-if="ele.show.hover == 'code'">{{ele.show.hoverTxt}}</div>
</template>

<script>
    export default {
        name: 'text',
        props: ['ele'],
        computed: {
            style: function () {
                return ""
            }
        },
        methods: {}
    }

</script>
