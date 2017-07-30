<template>
    <div class="sidebar f-cb">
        <ul class="nav nav-sidebar">
            <li v-for='item in sideBarList' :class="item.cls" v-on:click="select(item)">
                <router-link v-if="item.href" :to="item.href">{{ item.name }}</router-link>
                <a v-if="!item.href">{{ item.name }}</a>
            </li>
        </ul>
        <transition name="fade">
            <div class="no-padding oper-container" v-if="operCls==='show'">
                <transition name="fade">
                    <router-view keep-alive></router-view>
                </transition>
            </div>
        </transition>
    </div>
</template>

<script>
    import {
        mapState
    } from 'vuex'
    export default {
        name: 'side-bar',
        data() {
            return {
                operCls: 'show'
            }
        },
        computed: {
            ...mapState(['sideBarList'])
        },
        methods: {
            select: function (item) {
                if (item.cls === 'disp') {
                    item.name = item.name === '>>' ? '<<' : '>>'
                    this.operCls = this.operCls === 'hide' ? 'show' : 'hide'
                }
            }
        }
    }

</script>
