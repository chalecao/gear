/**
 * 元素基类
 */
const PROPS = {
    position: {
        width: 100,
        height: 50,
        left: 0,
        top: 0,
        position: 'absolute',
        float: '',
        marginTop: '',
        marginRight: '',
        marginBottom: '',
        marginLeft: '',
        borderStyle: '',
        borderColor: '',
        borderTop: '',
        borderRight: '',
        borderBottom: '',
        borderLeft: '',
        paddingTop: '',
        paddingRight: '',
        paddingBottom: '',
        paddingLeft: ''
    },
    show: {
        zIndex: '',
        boxType: '',
        display: '',
        overflow: '',
        cursor: '',
        textAlign: '',
        verticalAlign: '',
        backgroundTxt: '',
        borderTopLeftRadius: '',
        borderTopRightRadius: '',
        borderBottomRightRadius: '',
        borderBottomLeftRadius: ''
    },
    special: {
        eid: '', //元素id
        boxClassTxt: ''

    },
    other: {
        kid: "", //标识id
        pkid: "", //parent kid
        type: "",
        styleTxt: '',
        actionTxt: "click@func-123456", //标识动作值可以使click/mouseover/touch等等
        programTxt: ""
    },
    evt: {

    }
}
const VIEWPORT_BASE = {
    top: 37,
    left: 208
}
export default class Element {
    constructor(ele) {
        this.index = this.getKid();
        this.position = Object.assign({}, PROPS.position, ele.position)
        this.show = Object.assign({}, PROPS.show, ele.show)
        this.special = Object.assign({}, PROPS.special, ele.special)
        this.evt = Object.assign({}, PROPS.evt, ele.evt)
        this.other = Object.assign({}, PROPS.other, ele.other)
        this.other.kid = this.other.kid || ("element-" + this.index)
        this.other.type = this.other.type || "element"
        this.$drag = {
            offsetTop: VIEWPORT_BASE.top,
            offsetLeft: VIEWPORT_BASE.left
        };
    }
    getKid() {
        return (+new Date() + "").substr(-6);
    }
    setDragOffset(t, l) {
        this.$drag.offsetTop = t
        this.$drag.offsetLeft = l
    }
    handleDragEnd(e) {

    }
    handleDrag(e) {

        if (e.pageX == 0 && e.pageY == 0) {
            //不处理拖动最后一刻X和Y都为0的情形
            return;
        }
        if (e.pageX <= (this.position.left + this.$drag.offsetLeft) || e.pageY <= (this.position.top + this.$drag.offsetTop)) {
            //不处理拖动第一刻X和Y都为0的情形
            return;
        }

        this.position.top = (+e.pageY) - this.$drag.diffY - this.$drag.offsetTop;
        this.position.left = (+e.pageX) - this.$drag.diffX - this.$drag.offsetLeft;
        //阻止默认行为
        e.preventDefault();
        //阻止默认行为
        e.stopPropagation();
    }
    handleDragStart(e) {
        var crt = document.createElement("div");
        crt.style.display = "none";
        e.dataTransfer.setDragImage(crt, 0, 0);
        // 处理相对位移
        if (this.other.pkid) {
            this.$drag = {
                offsetTop: 37 + parseInt(e.target.parentNode.style.top),
                offsetLeft: 208 + parseInt(e.target.parentNode.style.left)
            };
        }

        this.$drag.diffX = +e.offsetX;
        this.$drag.diffY = +e.offsetY;
    }
    getStyle() {
        return this.getMargin() + this.getPadding() + this.getBorder() + this.getBorderRadius()　 +
            this.getDisplay() + this.getOverflow() + this.getBackground() + this.getCursor() + this.getZindex() + this.getTextAlign() + this.getVerticalAlign() + this.other.styleTxt
    }
    getPosition() {
        return 'position:' + this.position.position + ';left:' + this.position.left + 'px;top:' + this.position.top + 'px;'
    }
    getDisplay() {
        return this.show.display ? ('display:' + this.show.display + ';') : ""
    }
    getZindex() {
        return (this.show.zIndex.length && !isNaN(+this.show.zIndex)) ? ('z-index:' + this.show.zIndex + ';') : ""
    }
    getTextAlign() {
        return this.show.textAlign ? ('text-align:' + this.show.textAlign + ';') : "";
    }
    getVerticalAlign() {
        return this.show.verticalAlign ? ('vertical-align:' + this.show.verticalAlign + ';') : "";
    }
    pxORatio(v) {
        // return (v + "").match("%") ? v : (v + "px")
        return isNaN(+v) ? v : (v + "px")
    }
    isEmpty(l) {
        let flag = true;
        l.forEach((i) => {
            if (i && i.length) {
                flag = false;
            }
        })
        return flag;
    }
    getWH() {
        return 'width:' + this.pxORatio(this.position.width) + ';height:' + this.pxORatio(this.position.height) + ';'
    }

    getMargin() {
        let temp = [this.position.marginTop, this.position.marginRight, this.position.marginBottom, this.position.marginLeft];
        temp = temp.map((i) => {
            return this.pxORatio(i)
        })
        return this.isEmpty(temp) ? "" : ("margin:" + temp.join(" ") + ";")
    }
    getPadding() {
        let temp = [this.position.paddingTop, this.position.paddingRight, this.position.paddingBottom, this.position.paddingLeft];
        temp = temp.map((i) => {
            i = this.pxORatio(i)
        })
        return this.isEmpty(temp) ? "" : ("padding:" + temp.join(" ") + ";")
    }
    getBorder() {
        if (!this.position.borderStyle) {
            return "";
        }
        return "border-style:" + this.position.borderStyle + ";border-color:" + this.toHex(this.position.borderColor) +
            ";border-width:" + [this.position.borderTop || 0, this.position.borderRight || 0, this.position.borderBottom || 0, this.position.borderLeft || 0].join("px ") + "px;"
    }
    toHex(num) {
        return isNaN(+num) ? num : ("#" + num.toString(16))
    }
    getBorderRadius() {
        let temp = [this.show.borderTopLeftRadius, this.show.borderTopRightRadius, this.show.borderBottomRightRadius, this.show.borderBottomRightRadius];
        temp = temp.map((i) => {
            i = this.pxORatio(i)
        })
        return this.isEmpty(temp) ? "" : ("border-radius:" + temp.join(" ") + ";")
    }
    getOverflow() {
        let _of = "";
        switch (this.position.overflow) {
            case "visiable":
                _of = "overflow: visiable;"
                break;
            case "overflowX":
                _of = "overflow-x: hidden;"
                break;
            case "overflowY":
                _of = "overflow-y: hidden;"
                break;
            case "overflowXY":
                _of = "overflow: hidden";
                break;
        }
        return _of;
    }
    getBackground() {
        if (this.show.backgroundTxt) {
            return "background:" + this.toHex(this.show.backgroundTxt) + ";"
        } else {
            return "";
        }
    }
    getCursor() {
        return this.show.cursor ? ("cursor:" + this.show.cursor + ";") : ""
    }
    update() {
        if (this.show.hover) {
            this.special.boxClassTxt += "e-hover-source"
            this.show.cursor = "pointer"
        }
    }
    /**
     * click@func-123456 添加事件，@后面是关联的cache或action元素，click@这种会删除事件
     */
    updateAction() {
        let _e = this.other.actionTxt.split("@")
        if (_e[0]) {
            if (this.evt[_e[0]] && !_e[1]) {
                delete this.evt[_e[0]]
            } else if (_e[1]) {
                this.evt[_e[0]] = _e[1]
            }
        }
        this.other.actionTxt = ""
    }

    static map2element(prop) {
        var el = {
            position: {},
            show: {},
            special: {},
            other: {}
        };

        for (var k in PROPS.position) {
            el.position[k] = prop[k] || PROPS.position[k]
        }
        for (k in PROPS.show) {
            el.show[k] = prop[k] || PROPS.show[k]
        }
        for (k in PROPS.special) {
            el.special[k] = prop[k] || PROPS.special[k]
        }
        for (k in PROPS.other) {
            el.other[k] = prop[k] || PROPS.other[k]
        }
        return el
    }
    toJson() {
        let ele = {
            position: {},
            show: {},
            special: {},
            other: {},
            evt: {}
        }
        Object.assign(ele.position, this.position)
        Object.assign(ele.show, this.show)
        Object.assign(ele.special, this.special)
        Object.assign(ele.other, this.other)
        Object.assign(ele.evt, this.evt)
        return ele
    }
}
