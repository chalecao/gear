<template>
    <div id="compList" @click="clearSelect" @contextmenu="handleContextMenu">
        <div class="uploader">
            <input @change="handleImage" type="file" name="userprofile_picture" id="filePhoto" />
            <div class="tip">拖动文件到此或点击上传图片</div>
            <img :src="tempData" />
            <button type="button" class="btn btn-danger" @click="addData">添加</button>
        </div>
        <list :listData="dataList" :current="current" @click="handleClick" @dblclick="handleDblclick" @contextmenu="handleContextMenu"></list>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {
        mapState,
        mapGetters,
        mapActions,
        mapMutations
    } from 'vuex'
    import List from '@/components/List'
    import infoUtil from '@/service/infoUtil'
    export default {
        name: 'data-view',
        data() {
            return {
                tempData: "",
                vm: ""
            }
        },
        computed: {
            ...mapState({
                current: state => state.data.current,
                dataList: state => state.data.dataList
            })
        },
        components: {
            List
        },
        mounted() {
            this.$nextTick(function () { // 保证 this.$el 已经插入文档
                // this.initComponentData()
            })
        },
        methods: {
            handleImage(e) {
                let reader = new FileReader();
                reader.onload = function (event) {
                    this.tempData = event.target.result
                }.bind(this)
                reader.readAsDataURL(e.target.files[0]);
            },
            addData() {
                if (this.tempData)
                    this.AddData(this.tempData);
                this.tempData = "";
            },
            handleContextMenu(e, item, index) {
                let _listData = [];
                if (item) {
                    _listData.push({
                        text: "查看",
                        type: "item",
                        handleClick: function () {
                            this.viewImage(item)
                            this.vm.$el.innerHTML = ""
                            this.vm.$el.setAttribute("id", "contextMenu")
                        }.bind(this)
                    });
                    _listData.push({
                        text: "删除",
                        type: "item",
                        handleClick: function () {
                            this.DelData(index)
                            this.vm.$el.innerHTML = ""
                            this.vm.$el.setAttribute("id", "contextMenu")
                        }.bind(this)
                    });
                }
                _listData.push({
                    text: "清空",
                    type: "item",
                    handleClick: function () {
                        this.DelData()
                        this.vm.$el.innerHTML = ""
                        this.vm.$el.setAttribute("id", "contextMenu")
                    }.bind(this)
                })
                infoUtil.contextMenu(e, _listData)
            },
            viewImage(item) {
                var that = this;
                infoUtil.confirm({
                    title: "查看图片",
                    cancelTxt: "关闭",
                    listData: [{
                        label: "地址",
                        type: "Txt",
                        value: item.thumbnail || ""
                    }]
                }, )
            },
            clearSelect(kid) {
                infoUtil.clearContextMenu()
                //阻止默认行为
                e.preventDefault();
                e.stopPropagation();
            },
            handleDblclick(item, index) {
                this.SetDateCompCurrent(index)
            },
            handleClick(item, index) {
                this.SetDateCompCurrent(index)
            },
            ...mapMutations(['SetDateCompCurrent']),
            ...mapMutations(['AddData']),
            ...mapMutations(['DelData'])
        }
    }

</script>
