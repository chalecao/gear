/**
 * 文本类
 */
import Element from './element'
const SPECIAL = {
    textTxt: 'text文本',
    fontFamily: '',
    fontSize: '',
    lineHeight: '',
    color: '',
    type: 'span', //pan/h3/p/b
    target: "",
    targetUrl: ''
}
export default class Text extends Element {
    constructor(eleData) {
        super(eleData)
        if (this.other.kid.match("element-")) {
            this.other.kid = "text-" + this.index;
        }
        this.other.type = this.other.type || "text";
        this.show.display = this.show.display || "inline-block";
        this.special = Object.assign(this.special || {}, SPECIAL, eleData.special)
    }
    getSpecialStyle() {
        return super.getWH() + super.getStyle() + "font-size:" + super.pxORatio(this.special.fontSize) + ";color:" + this.special.color + ";line-height:" + super.pxORatio(this.special.lineHeight) + ";"
    }
    static map2element(prop) {
        let el = Element.map2element(prop);
        for (let k in SPECIAL) {
            el.special[k] = prop[k] || SPECIAL[k]
        }
        el.special.target = prop.newBlank ? "_blank" : "_top"
        return new this(el)
    }
    update() {
        if (this.special.targetUrl) {
            this.show.cursor = "pointer"
        }
    }

}
