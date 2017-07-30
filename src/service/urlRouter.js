import storage from './localstorage'
export default {
    currenPage: "",
    projectPage: "",
    reset: function () {
        this.currenPage = ""
        this.projectPage = ""
    },
    init: function () {
        debugger
        let name = this.computeSubPagename()
        if (name) {
            this.projectPage = JSON.parse(storage.get("projectList") || "[]")
            this.currenPage = this.projectPage.find(a => {
                return a.name == name.split("_")[0]
            })
        }
        // if (!location.href.match("page/element")) {
        //     location.hash = '#/project'
        // }
        // if (this.currenPage) {
        //     if (location.hash.split("?")[1]) {
        //         location.hash = '#/page/module?' + location.hash.split("?")[1]
        //     } else {
        //         location.hash = '#/page/module'
        //     }
        // }
    },
    computeSubPagename: function () {
        let _pname = ""
        if (location.hash.split("?")[1]) {
            _pname = location.hash.split("?")[1].match(/path\=([\s\S]*?)$/)
        }
        debugger
        return _pname && _pname[1];
    },
    getDefaultPage: function () {
        debugger
        let _page = JSON.parse(storage.get(this.currenPage.name + "-pageList") || "[]").filter(a => {
            return a.type == "page"
        })
        if (_page.length > 1) {
            let subname = this.computeSubPagename();
            if (subname) {
                return _page.find(a => {
                    return a.name == subname.split("_")[1]
                })
            } else {
                return ""
            }
        } else {
            return _page[0]
        }
    }
}
