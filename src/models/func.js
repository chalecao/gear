/**
 * 函数类
 * IF函数，弃用，通过computed property 来控制展示，这样可以减少DOM树开销
 * FOR函数，for函数内容对应于其所有子元素
 * CACHE函数, 只会注入到对于cache文件和UI文件中，并不作其他处理
 */
import Element from './element'
const SPECIAL = {
    funcType: 'for', //for/cache
    language: "vue" //vue/react
}
const FUNC_CONTENT = {
    "if": {
        cond: ""
    },
    "for": {
        listTxt: "{}"
    }
}
export default class Func extends Element {
    constructor(eleData) {
        super(eleData)
        if (this.other.kid.match("element-")) {
            this.other.kid = "func-" + this.index;
        }
        this.other.type = this.other.type || "func";
        this.special = Object.assign(this.special || {}, SPECIAL, eleData.special)

        if (this.special.funcType && FUNC_CONTENT[this.special.funcType])
            this.special = Object.assign({}, FUNC_CONTENT[this.special.funcType], this.special)
    }
    update() {
        if (this.special.funcType && FUNC_CONTENT[this.special.funcType]) {
            this.special = Object.assign({}, FUNC_CONTENT[this.special.funcType], this.special)
            Object.keys(FUNC_CONTENT).forEach((k) => {
                if (k != this.special.funcType) {
                    Object.keys(FUNC_CONTENT[k]).forEach((sk) => {
                        delete this.special[sk]
                    })
                }
            })
        }
    }

}
