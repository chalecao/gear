<template>
    <nav class="navbar navbar-default navbar-fixed-top">
        <div id="navbar" class="navbar-collapse">
            <ul class="nav navbar-nav">
                <li class="active"><a href="#"><img width="20px" src="../../static/img/logo.png">Gear</a></li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button">操作 <span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li><a @click="importDataFromUrl">加载数据模型</a></li>
                        <li><a @click="importData">导入</a></li>
                        <li><a @click="saveAs">导出数据模型</a></li>
                        <li><a @click="exportHtml">导出代码...</a></li>
                    </ul>
                </li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button">项目 <span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li><a @click="setPub">发布配置</a></li>
                        <li><a @click="setOSS">OSS配置</a></li>
                        <li class="divider"></li>
                        <li><a @click="preview">预览</a></li>
                        <li><a @click="publishPage">发布页面</a></li>
                        <li><a @click="publishProject">发布项目</a></li>
                    </ul>
                </li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button">机型 <span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li><a @click="handleWidthHeight(1920,1080)">Web@高清1k</a></li>
                        <li><a @click="handleWidthHeight(2560,1440)">Web@高清2k</a></li>
                        <li class="divider"></li>
                        <li><a @click="handleWidthHeight(375,667)">H5@iphone7</a></li>
                        <li><a @click="handleWidthHeight(414,736)">H5@iphone7P</a></li>
                        <li><a @click="handleWidthHeight(320,568)">H5@iphone5</a></li>
                        <li><a @click="handleWidthHeight(768,1024)">H5@ipad</a></li>
                        <li><a @click="handleWidthHeight(360,640)">H5@android</a></li>
                    </ul>
                </li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button">关于 <span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li><a href="https://github.com/chalecao/gear.git" target="_blank">使用说明(Github)</a></li>
                        <li><a href="http://www.haomou.net" target="_blank">官方博客</a></li>
                        <li><a href="mailto:ch19900606@gmail.com">联系作者(chalecao)</a></li>
                    </ul>
                </li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
                <li>
                    <div class="input-group w-150">
                        <input type="text" class="form-control" v-model="width">
                        <span class="input-group-addon">×</span>
                        <input type="text" class="form-control" v-model="height">
                    </div>
                </li>
                <li>
                    <div class="btn-group">
                        <button type="button" class="btn btn-primary" @click="handleZoomIn"><span class="glyphicon glyphicon-plus"></span></button>
                        <input type="text" class="btn scale" v-model="scale">
                        <button type="button" class="btn btn-success" @click="handleZoomOut"><span class="glyphicon glyphicon-minus"></span></button>
                    </div>
                </li>
                <li>
                    <div class="btn-group">
                        <button type="button" class="btn" :class="mode=='web'?'btn-danger':''" @click="handleWeb">web</button>
                        <button type="button" class="btn" :class="mode=='h5'?'btn-danger':''" @click="handleH5">H5</button>
                    </div>
                </li>
                &nbsp;&nbsp;&nbsp;
            </ul>
        </div>
    </nav>
</template>
<script>
    import {
        mapState,
        mapMutations,
        mapActions
    } from 'vuex'
    import Vue from 'vue'
    import _ from 'lodash'
    import infoUtil from '@/service/infoUtil'
    import util from '@/service/util'
    import storage from '@/service/localstorage'
    export default {
        name: 'nav',
        computed: {
            ...mapState({
                widthV: state => state.viewport.width,
                heightV: state => state.viewport.height,
                scaleV: state => state.viewport.scale,
                mode: state => state.viewport.mode
            }),
            scale: {
                get: function () {
                    return this.scaleV
                },
                // setter
                set: function (w) {
                    this.handleScale(w);
                }
            },
            width: {
                get: function () {
                    return this.widthV
                },
                // setter
                set: function (w) {
                    this.handleWidthHeight(w, this.height);
                }
            },
            height: {
                get: function () {
                    return this.heightV
                },
                // setter
                set: function (h) {
                    this.handleWidthHeight(this.width, h);
                }
            }
        },
        mounted() {
            this.$nextTick(function () {
                if (!storage.get("projectList") || storage.get("projectList") == "[]" ) {
                    this.importDataFromUrl()
                }
            })
        },
        components: {},
        methods: {
            handleWeb() {
                this.SetMode("web")
                this.handleWidthHeight(1920, 1080)
            },
            handleWidthHeight: _.debounce(function (w, h) {
                this.SetViewport({
                    width: +w,
                    height: +h
                });
            }, 200),
            handleScale: _.debounce(function (w) {
                this.SetScale(w);
            }, 500),
            handleH5() {
                this.SetMode("h5")
                this.handleWidthHeight(375, 667)
            },
            handleZoomIn() {
                this.ZoomIn()
            },
            handleZoomOut() {
                this.ZoomOut()
            },
            importDataFromUrl() {
                debugger
                let that = this
                infoUtil.confirm({
                    title: "导入项目",
                    okTxt: "确定",
                    cancelTxt: "取消",
                    listData: [{
                        label: "URL",
                        type: "input",
                        value: "../data/gear_storage.gear",
                        key: "name",
                        tip: "导入项目模型数据"
                    }]
                }, function (data) {
                    util.request(data[0].value, "get", {})
                        .then((data) => {
                            if (typeof data == "string") {
                                data = JSON.parse(data)
                            }
                            //这里处理成功回调
                            that.ImportData(data)
                        })
                        .catch((data) => {});
                })
            },
            importData() {
                var $projectInput = $("<input type='file' />");
                $projectInput[0].addEventListener("change", this.uploadProjectFile);
                $projectInput.click();

            },
            uploadProjectFile(e) {
                var file = e.target.files[0];
                if (file && (file.name.substr(-4) === 'gear')) {
                    var fileReader = new FileReader();
                    //如果是组件文件
                    fileReader.onload = function (e) {
                        fileReader.onload = null;
                        this.ImportData(JSON.parse(e.target.result || "{}"))
                    }.bind(this)
                    fileReader.readAsText(file);
                }
            },
            saveAs() {
                this.SaveAs()
            },
            exportHtml() {

            },
            setPub() {

            },
            setOSS() {

            },
            publishPage() {

            },
            publishProject() {

            },
            preview() {

            },
            ...mapActions(['ImportDataFromUrl']),
            ...mapActions(['ImportData']),
            ...mapActions(['SaveAs']),
            ...mapMutations(['SetScale']),
            ...mapMutations(['ZoomIn']),
            ...mapMutations(['ZoomOut']),
            ...mapMutations(['SetMode']),
            ...mapMutations(['SetViewport'])
        }
    }

</script>
