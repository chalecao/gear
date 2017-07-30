<template>
    <div :class="ele.parent?'':'pageWall'" :style="styl">
        <div class="panel panel-default ">
            <div class="panel-heading">
                <a v-if="href" :href="href">
                    <h3 class="panel-title">{{ele.name}}</h3>
                </a>
                <h3 v-else class="panel-title">{{ele.name}}</h3>
            </div>
            <div class="panel-body">
                {{ele.desc}}
            </div>
        </div>
        <div :class="ele.name"></div>
    </div>
</template>

<script>
    export default {
        name: 'panel',
        props: ['ele'],
        data() {
            return {
                styl: "",
                href: ""
            }
        },
        mounted() {
            this.$nextTick(function () { // 保证 this.$el 已经插入文档
                if (this.ele.parent) {
                    $("." + this.ele.parent).append(this.$el)
                    // var _p = getComputedStyle($("." + this.ele.parent)[0])
                    // console.log(_p.left)
                    this.href = '#/page/element?path=' + this.ele.parent + "_" + this.ele.name
                    this.styl = {
                        // border: "1px solid red",
                        float: "left"
                        // top: parseFloat(_p.top) + parseFloat(_p.height) + 20 + "px",
                        // left: parseFloat(_p.left) + 20 + "px"
                    }
                }
            })
        },
        methods: {}
    }

</script>
