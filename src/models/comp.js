/**
 * 文本类
 */
import Element from './element'
const SPECIAL = {
    compName: ""
}
export default class Comp extends Element {
    constructor(eleData) {
        super(eleData)
        if (this.other.kid.match("element-")) {
            this.other.kid = "comp-" + this.index;
        }
        this.other.type = this.other.type || "comp";
        this.special = Object.assign(this.special || {}, SPECIAL, eleData.special)
        this.position.width = this.position.width || "auto";
        this.position.height = this.position.height || "auto";
    }
    static map2element(prop) {
        let el = Element.map2element(prop);
        for (let k in SPECIAL) {
            el.special[k] = prop[k] || SPECIAL[k]
        }
        return new this(el)
    }
    update() {}

}
