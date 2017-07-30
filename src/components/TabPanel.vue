<template id="tab-panel">
    <div class="side-cont">
        <!-- Nav tabs -->
        <ul class="nav nav-tabs" role="tablist">
            <li v-for='(item, index) in tabList' role="presentation" @click="clickOnTabItem($event,item,index)">
                <router-link v-if="item.href" :to="item.href">{{ item.name }}</router-link>
            </li>
        </ul>

        <!-- Tab panes -->
        <div class="tab-content">
            <div role="tabpanel" class="tab-pane show">
                <transition name="slide">
                    <router-view keep-alive></router-view>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'tab-panel',
        props: ['tabList'],
        methods: {
            clickOnTabItem: function (e, item, index) {
                this.$emit('tabClick', item, index)
            }
        }
    }

</script>
