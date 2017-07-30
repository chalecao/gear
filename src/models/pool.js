/**
 * 文本类
 */
import Element from './element'
const SPECIAL = {
        ref: ''
    },
    OTHER = {
        ele: ''
    }
export default class Pool extends Element {
    constructor(eleData) {
        super(eleData)
        if (this.other.kid.match("element-")) {
            this.other.kid = "pool-" + this.index;
        }
        this.other.type = this.other.type || "pool"
        this.other.ele = this.other.ele || eleData.other.ele
        this.$el = document.createElement(this.other.ele)
        this.special = Object.assign(this.special || {}, SPECIAL, eleData.special)

        for (var attr in this.special) {
            if (attr.substr(-5) == "_attr" && this.special[attr]) {
                this.$el.setAttribute(attr, this.special[attr] || "")
            }
        }
    }
    update() {
        for (var attr in this.$data) {
            this.$el.setAttribute(attr, this.special[attr] || "")
        }
    }
    static map2element(prop) {
        let el = Element.map2element(prop);
        for (let k in SPECIAL) {
            el.special[k] = prop[k] || SPECIAL[k]
        }
        el.other.ele = prop.ele
        return new this(el)
    }

}
