/**
 * CACHE函数, 只会注入到对于cache文件和UI文件中，并不作其他处理
 */
import Element from './element'
const SPECIAL = {
    language: "vue", //vue/react
    codeTxt: ''
}
export default class Action extends Element {
    constructor(eleData) {
        super(eleData)
        if (this.other.kid.match("element-")) {
            this.other.kid = "action-" + this.index;
        }
        this.other.type = this.other.type || "action";
        this.special = Object.assign(this.special || {}, SPECIAL, eleData.special)
        this.show.backgroundTxt = "#5cb85c"
    }
    update() {}
    handle(param, callback) {
        this.special.codeTxt && eval(this.special.codeTxt);
        callback && callback()
    }
}
