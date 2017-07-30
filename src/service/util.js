import Vue from 'vue'
export default {
    orderElement: function (dataList) {
        let listData = [], //元素列表展示的顺序， 树形
            orderData = [], // viewport中展示的顺序，先一级、二级、三级
            cnt = 0,
            temp,
            tempI = -1;
        dataList.forEach((a, i) => {
            if (!a.other.pkid) {
                listData.push({
                    name: a.other.kid,
                    kid: a.other.kid,
                    pkid: a.other.pkid,
                    type: a.other.type,
                    oindex: orderData.length
                })
                orderData.push({
                    kid: a.other.kid,
                    children: []
                })
            } else {
                cnt++
            }
        })
        let cycleCnt = 0;
        while (cnt > 0 && cycleCnt < 10) {
            cycleCnt++;
            cnt = 0
            dataList.forEach((a, ind) => {
                if (a.other.pkid) {
                    temp = listData.find((b, index) => {
                        tempI = index
                        return a.other.pkid == b.kid
                    })
                    if (temp) {
                        listData.splice(tempI + 1, 0, {
                            name: "-" + (temp.name[0] == '-' ? temp.name.split(
                                " ")[0] : "") + " " + a.other.kid,
                            kid: a.other.kid,
                            type: a.other.type,
                            pkid: a.other.pkid,
                            oindex: orderData.length
                        })
                        orderData[temp.oindex].children.push(orderData.length)
                        orderData.push({
                            kid: a.other.kid,
                            children: []
                        })
                    } else if (a.other.pkid != a.other.kid) {
                        cnt++
                    }
                }
            })
        }
        return {
            listData: listData,
            orderData: orderData
        }
    },
    /**
     * exp 2 data
     * _key:  data:name
     * data: {name:"12312"}
     * return: "12312"
     */
    exp2value: function (_key, data) {
        if (!_key.match("base64") && !_key.match("http") && 　_key.match(":") && data) {
            let res = {
                "data": JSON.parse(data)
            }
            _key.split(":").forEach((k) => {
                if (res[k])
                    res = res[k]
            })
            return res
        } else {
            return _key
        }
    },
    request: function (url, method, params) {
        return new Promise((resolve, reject) => {
            if (!Vue.http[method]) {
                resolve("")
            }
            Vue.http[method](
                    url, params, {
                        emulateJSON: true
                    }
                )
                .then((res) => {
                    resolve(res.body);
                })
                .catch((res) => {
                    reject(res);
                });
        });
    },
    getCookie: function (key) {

    },
    setCookie: function (key, value) {

    }
}
