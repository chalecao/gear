/**
 * 文本类
 */
import Element from './element'
const SPECIAL = {
    src: '',
    target: '_top',
    targetUrl: ''
}
export default class Image extends Element {
    constructor(eleData) {
        super(eleData)
        if (this.other.kid.match("element-")) {
            this.other.kid = "img-" + this.index;
        }
        this.other.type = this.other.type || "image";
        this.special = Object.assign(this.special || {}, SPECIAL, eleData.special)
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
