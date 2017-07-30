<template>
    <div class="list-group">
        <div v-for="(item, index) in listData" class="list-group-item">
            <div class="input-group">
                <span class="input-group-addon">{{item.name}}</span>
                <input type="text" class="form-control" :value="item.value">
            </div>
        </div>
    </div>
</template>

<script>
    import {
        mapState,
        mapGetters,
        mapActions,
        mapMutations
    } from 'vuex'
    export default {
        name: 'input-list',
        computed: {
            ...mapState(['position', 'show', 'type']),
            listData: function () {
                let list = []
                if (this.type == 'position') {
                    for (var k in this.position) {
                        list.push({
                            name: k,
                            value: this.position[k]
                        })
                    }
                }
                return list
            }
        },
        methods: {

        }
    }

</script>
