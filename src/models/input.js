/**
 * 标准输入框
 */
import Element from './element'
const SPECIAL = {
    placeHolder: '请输入',
    type: 'text',
    fontSize: '',
    lineHeight: '',
    color: '',
    name: ''
}
const Input_CONTENT = {
    "radio": {
        desc: "选项"
    },
    "checkbox": {
        desc: "选项"
    }
}
export default class Input extends Element {
    constructor(eleData) {
        super(eleData)
        if (this.other.kid.match("element-")) {
            this.other.kid = "input-" + this.index;
        }
        this.other.type = this.other.type || "input";
        this.show.display = this.show.display || "inline-block";
        this.special = Object.assign(this.special || {}, SPECIAL, eleData.special)
        if (Input_CONTENT[this.special.type])
            this.special = Object.assign({}, Input_CONTENT[this.special.type], this.special)
    }
    getSpecialStyle() {
        return super.getWH() + super.getStyle() + "font-size:" + super.pxORatio(this.special.fontSize) + ";color:" + this.special.color + ";line-height:" + super.pxORatio(this.special.lineHeight) + ";"
    }
    static map2element(prop) {
        let el = Element.map2element(prop);
        for (let k in SPECIAL) {
            el.special[k] = prop[k] || SPECIAL[k]
        }
        return new this(el)
    }
    update() {
        if (Input_CONTENT[this.special.type]) {
            this.special = Object.assign({}, Input_CONTENT[this.special.type], this.special)
        } else {
            delete this.special.desc
        }
    }
}
