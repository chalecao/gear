/**
 * CACHE函数, 只会注入到对于cache文件和UI文件中，并不作其他处理
 */
import Element from './element'
import Util from '../service/util'
const SPECIAL = {
    language: "vue", //vue/react
    url: '',
    csrf: '', //默认从cookie获取
    method: '',
    param: '',
    callBack: ''
}
export default class Cache extends Element {
    constructor(eleData) {
        super(eleData)
        if (this.other.kid.match("element-")) {
            this.other.kid = "cache-" + this.index;
        }
        this.other.type = this.other.type || "cache";
        this.special = Object.assign(this.special || {}, SPECIAL, eleData.special)
        this.show.backgroundTxt = "yellow"
    }
    update() {}
    handle(param, callback) {
        let _url = this.special.url;
        if (this.special.csrf) {
            _url += "?csrf=" + (Util.getCookie(this.special.csrf) || this.special.csrf)
        }
        Util.request(_url, this.special.method, param || JSON.parse(this.special.param || "{}"))
            .then((data) => {
                //这里处理成功回调
                callback && callback(data)
            })
            .catch((data) => {
                //这里处理失败回调
                console.log(this.special.url + "--请求异常")
                console.log(data)
            });
    }
}
