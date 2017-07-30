/**
 * 文本类
 */
import Element from './element'
import Text from './text'
import Input from './input'
import Image from './image'
import Pool from './pool'
import Func from './func'
import Hover from './hover'
import Comp from './comp'
import Action from './action'
import Cache from './cache'
const clsList = {
    element: Element,
    text: Text,
    input: Input,
    image: Image,
    func: Func,
    cache: Cache,
    action: Action,
    hover: Hover,
    pool: Pool,
    comp: Comp
}
export default class Factory {

    constructor(ele) {
        this.ele = ele
    }

    creatElement() {
        if (clsList[this.ele.other.type]) {
            return new clsList[this.ele.other.type](this.ele)
        }
    }
    /**
     * 废弃，后面不再兼容cmp的数据结构
     * @param {*} prop
     */
    static map2element(prop) {
        return clsList[prop["other"]["type"].toLowerCase() || "element"].map2element(prop)
    }

}
