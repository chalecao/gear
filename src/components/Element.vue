<template>
    <div :data="data" :draggable="getEditMode() && ckid == ele.other.kid" @click="handleClick" @dragstart="handleDragStart" @drag="handleDrag"
        @dragend="handleDragEnd" :id="ele.special.eid" :class="ele.special.boxClassTxt+' '+ele.other.kid+' '+ele.other.type"
        :style="cstyle">
        <BSKComp v-if="ele.other.type=='comp'" :ele="ele" :data="data"></BSKComp>
        <BSKText :listeners="listeners" v-if="ele.other.type=='text'" :ele="ele" :data="data"></BSKText>
        <BSKInput v-if="ele.other.type=='input'" :ele="ele" :data="data"></BSKInput>
        <BSKCache v-if="ele.other.type=='cache'" :ele="ele"></BSKCache>
        <BSKAction v-if="ele.other.type=='action'" :ele="ele"></BSKAction>
        <BSKFunc v-else-if="ele.other.type=='func'" :ele="ele">
            <template slot="item" scope="props">
                <div :data="props.item" v-for="i in ele.$children" :class="ele.other.kid+''+i"></div>
            </template>
        </BSKFunc>
        <BSKImage :data="data" v-else-if="ele.other.type=='image'" :ele="ele"></BSKImage>
        <div v-if="ele.other.type=='pool'" v-pool="ele"></div>
        <BSKHover v-else-if="ele.other.type=='hover'" :ele="ele">
            <div v-for="i in ele.$children" :class="ele.other.kid+''+i"></div>
        </BSKHover>
        <div :data="data" v-else-if="ele.other.type=='element'" v-for="i in ele.$children" :class="ele.other.kid+''+i"></div>
        <span class="evt-tip" @click="showAction(evtTip)" v-if="evtTip" v-html="evtTip"></span>
        <div class="element-select-outline" :data-width="ele.position.width" :data-height="ele.position.height" v-if="getEditMode() && ckid == ele.other.kid">
            <div class="resize-control tl"></div>
            <div class="resize-control tc"></div>
            <div class="resize-control tr"></div>
            <div class="resize-control lc"></div>
            <div class="resize-control rc"></div>
            <div class="resize-control bl"></div>
            <div class="resize-control bc"></div>
            <div class="resize-control br"></div>
        </div>
    </div>
</template>

<script>
    import BSKText from '@/components/Text'
    import BSKInput from '@/components/Input'
    import BSKFunc from '@/components/Func'
    import BSKCache from '@/components/Cache'
    import BSKAction from '@/components/Action'
    import BSKHover from '@/components/Hover'
    import BSKImage from '@/components/Image'
    import Vue from 'vue'
    Vue.directive('pool', function (el, binding) {
        (el.parentNode || el.parentElement || el).appendChild(binding.value.$el);
    })
    export default {
        name: 'element',
        props: ['ele', 'ckid', 'data', "listeners"],
        data() {
            return {
                evtTip: ""
            }
        },
        beforeCreate: function () {
            this.$options.components.BSKComp = require('./Comp.vue')
        },
        computed: {
            cstyle: function () {
                if (this.ele.other.type != 'text' && this.ele.other.type != 'input') {
                    return this.ele.getWH() + this.ele.getPosition() + this.ele.getStyle()
                } else {
                    return "width:auto;height:auto;" + this.ele.getPosition() + this.ele.getDisplay()
                }
            }
        },
        components: {
            BSKText,
            BSKInput,
            BSKFunc,
            BSKCache,
            BSKAction,
            BSKHover,
            BSKImage
        },
        mounted() {
            this.$nextTick(function () { // 保证 this.$el 已经插入文档
                this.$watch('ele', _.debounce(function (newValue, oldValue) {
                    this.handleEvtTip();
                }.bind(this), 400), {
                    deep: true
                })
                this.handleEvtTip();
            })
        },
        methods: {
            getEditMode() {
                return window.gear['editMode']
            },
            handleEvtTip() {
                let _e = ""
                Object.keys(this.ele.evt).forEach((a) => {
                    _e += a + "@" + this.ele.evt[a] + "<br>"
                })
                this.evtTip = _e
            },
            showAction(evtTip) {
                this.ele.other.actionTxt = evtTip.replace(/\<br\>/g, " ")
            },
            handleDragStart(e) {
                if (this.getEditMode()) {
                    this.ele.handleDragStart(e);
                    e.stopPropagation();
                }
            },
            handleDragEnd(e) {
                if (this.getEditMode()) {
                    this.ele.handleDragEnd(e);
                    e.stopPropagation();
                }
            },
            handleDrag(e) {
                if (this.getEditMode()) {
                    this.ele.handleDrag(e);
                    e.stopPropagation();
                }
            },
            handleClick(e) {
                this.$emit('click', this.ele.other.kid)
                // e.stopPropagation();
            }
        }
    }

</script>
