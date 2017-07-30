/**
 * 文本类
 */
import Element from './element'
const SHOW = {
    hover: '',
    hoverTxt: ''

}
export default class Hover extends Element {
    constructor(el) {
        super(el)
        if (this.other.kid.match("element-")) {
            this.other.kid = "hover-" + this.index;
        }
        this.other.type = this.other.type || "hover";
        this.show = Object.assign(this.show || {}, eleData.SHOW || SHOW)
        this.show.cursor = "pointer"
    }
    getStyle() {
        return super.getStyle();
    }
    static map2element(prop) {
        let el = Element.map2element(prop);
        for (k in SHOW) {
            el.show[k] = prop[k] || SHOW[k]
        }
        el.show.cursor = "pointer"
        el.show["hoverTxt"] = prop["hoverComponent"]
        return new this(el)
    }
    update() {

    }

}
