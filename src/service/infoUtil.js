import Vue from 'vue'
import Modal from '@/components/Modal'
import ContextMenu from '@/components/ContextMenu'

export default {
    cm: "",
    vm: "",
    confirm: function (_props, _okFunc) {
        if (this.vm) {
            this.vm.$el.innerHTML = ""
            this.vm.$el.setAttribute("id", "modalId")
        }
        this.vm = new Vue({
            el: "#modalId",
            render: page => page(Modal, {
                props: _props,
                on: {
                    cancel: function (data) {
                        this.vm.$el.innerHTML = ""
                        this.vm.$el.setAttribute("id", "modalId")
                    },
                    ok: function (data) {
                        _okFunc && _okFunc(data)
                        this.vm.$el.innerHTML = ""
                        this.vm.$el.setAttribute("id", "modalId")
                    }.bind(this)
                }
            })
        })
    },
    contextMenu: function (e, _listData) {
        if (this.cm) {
            this.cm.$el.innerHTML = ""
            this.cm.$el.setAttribute("id", "contextMenu")
        }
        this.cm = new Vue({
            el: "#contextMenu",
            render: page => page(ContextMenu, {
                props: {
                    listData: _listData,
                    x: e.pageX,
                    y: e.pageY - 40
                },
                on: {
                    click: function (data) {
                        this.cm.$el.innerHTML = ""
                        this.cm.$el.setAttribute("id", "contextMenu")
                    }.bind(this)
                }
            })
        })
        //阻止默认行为
        e.preventDefault();
        e.stopPropagation();
    },
    clearContextMenu: function () {
        if (this.cm) {
            this.cm.$el.innerHTML = ""
            this.cm.$el.setAttribute("id", "contextMenu")
        }
    }
}
