<template>
    <div id="myModal" class="modal" :style="'display:'+display">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" @click="handleCancel">&times;</button>
                    <h4 class="modal-title" id="myModalLabel">{{title}}</h4>
                </div>
                <div class="modal-body">
                    <div v-if="content">{{content}}</div>
                    <div class="input-group" v-if="listData" v-for="item in listData">
                        <span class="input-group-addon">{{item.label}}</span>
                        <input v-if="item.type!= 'Txt'" type="text" class="form-control" v-model="item.value" :placeholder="item.tip">
                        <textarea v-if="item.type == 'Txt'" type="text" class="form-control" v-model="item.value" :placeholder="item.tip"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" v-if="cancelTxt" @click="handleCancel">{{cancelTxt}}</button>
                    <button type="button" class="btn btn-primary" v-if="okTxt" @click="handleOk">{{okTxt}}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'modal',
        data() {
            return {
                display: 'block'
            }
        },
        props: ['cancelTxt', 'okTxt', 'title', 'listData', 'content'],
        methods: {
            handleCancel() {
                this.$emit('cancel', this.listData)
                this.hide()
            },
            hide() {
                this.display = 'none'
            },
            handleOk() {
                this.$emit('ok', this.listData)
                this.hide()
            },
        }
    }

</script>
<style scoped>
    .modal {
        display: block;
    }

</style>
