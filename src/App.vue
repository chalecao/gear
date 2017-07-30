<template>
    <div :class="editMode?'body':''" @click.ctrl="activeEdit">

        <!-- Fixed navbar -->
        <div :class="editMode?'':'f-dn'">
            <div id="navContainer"></div>
        </div>
        <div :class="editMode?'main':''">
            <div :class="editMode?'':'f-dn'">
                <div id="sideBarContainer"></div>
            </div>
            <div class="viewportContainer">
                <div class="no-padding" id="viewportContainer"></div>
            </div>
            <div class="no-padding" :class="editMode?'':'f-dn'">
                <div id="propertyContainer"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        mapState,
        mapMutations
    } from 'vuex'
    export default {
        name: 'app',
        computed: {
            ...mapState(['editMode', 'sideBarList'])
        },
        methods: {
            activeEdit: function () {
                this.$store.dispatch('SetEditMode', !this.editMode)
            }
        }
    }

</script>
