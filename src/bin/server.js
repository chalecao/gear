/**
 * a barebones HTTP server in JS
 */

var port = 8888,
    http = require('http'),
    urlParser = require('url'),
    fs = require('fs'),
    path = require('path'),
    // __dirname 获取的是当前软件的路径，是内置变量；process.cwd()获取的是当前命令行目录
    currentDir = process.cwd();

import journey from 'journey';
import {
    resolve,
    dirname,
    join
} from "path";

let poolCompConfig = require(currentDir + "/.cmp/config/pool-component.config");
let pageCompConfig = require(currentDir + "/.cmp/config/page-component.config");
let commonCompConfig = require(currentDir + "/.cmp/config/common-component.config");
//
// Create a Router
//
var router = new(journey.Router);

// 创建所有目录
function mkdirs(dirpath, mode, callback) {
    fs.exists(dirpath, function (exists) {
        if (exists) {
            console.log("exists " + dirpath);
            callback(dirpath);
        } else {
            //尝试创建父目录，然后再创建当前目录
            mkdirs(dirname(dirpath), mode, function () {
                console.log("making " + dirpath);
                var di = dirpath.split("/");
                if (di[di.length - 1].indexOf(".") <= 0) {
                    fs.mkdir(dirpath, mode, callback);
                } else {
                    console.log(dirpath + " is not path");
                    callback();
                }
            });
        }
    });
}

function createPath(_file, cb) {
    if (_file.lastIndexOf("/") != _file.length - 1) {
        var _dir = _file.substring(0, _file.lastIndexOf("/"));
        fs.exists(_dir, function (exists) {
            if (exists) {
                cb();
            } else {
                console.log("dir not exists, create path " + _dir);
                mkdirs(_dir, [0x777], function (err) {
                    if (err) {
                        console.log("create path error, path: " + _dir);
                    } else {
                        cb();
                    }

                });
            }
        });
    }
}

function createAndWriteFile(_file, content, needBackup) {
    // cmp文件需要备份
    if (_file.indexOf("cmp") > 0) {
        needBackup = true;
    } else {
        needBackup = false;
    }
    createPath(_file, function () {
        fs.exists(_file, function (exists) {
            if (exists) {
                // serve file
                if (needBackup) {
                    console.log(_file + "文件已存在，重命名为" + _file + "_backup");
                    exec("mv " + _file + " " + _file + "_backup", function () {
                        fs.writeFile(_file, content, function (err) {
                            if (err) throw err;
                            console.log('保存成功');
                        });
                    });
                } else {
                    fs.writeFile(_file, content, function (err) {
                        if (err) throw err;
                        console.log('保存成功');
                    });
                }
            } else {
                fs.writeFile(_file, content, function (err) {
                    if (err) throw err;
                    console.log('保存成功');
                });
            }

        });
    });
}


//写文件
function writeFile(path, content) {
    var _file = currentDir + path;
    createAndWriteFile(_file, content, {});

}

// Create the routing table
//{
// ext: '{"name":"' + _compName + '", "url":"' + _dest + '"}',
//     cmpData: _contBuild
// }
router.map(function () {
    this.post(/^api\/(.*)$/).bind(function (req, res, id, data) {
        console.log(id);
        var _ext = JSON.parse(data.ext);
        console.log(_ext.name);

        //简单的校验
        if (id == _ext.name) {

            //去除路径 ../前面的..
            if (_ext.url.substr(0, 2) == ".." || _ext.url.substr(0, 1) == "." || _ext.url.substr(0, 1) == "/") {
                // 写组件模型
                if (/^\.\.\/([\/[\w||\.||\-]+\/]*)?\w+/.test(_ext.url)) {
                    writeFile(_ext.url.substr(2), data.cmpData);
                } else if (/^\.\/([\/[\w||\.||\-]+\/]*)?\w+/.test(_ext.url)) {
                    writeFile(_ext.url.substr(1), data.cmpData);
                } else if (/^\/([\/[\w||\.||\-]+\/]*)?\w+/.test(_ext.url)) {
                    writeFile(_ext.url.substr(0), data.cmpData);

                } else {
                    res.send(200, {}, {
                        code: -2,
                        message: "组件模型路径不合法"
                    });
                }

            } else {
                // 写绝对路径地址
                if (/^([A-Za-z]{1}:[\/[\w||\.||\-]+\/]*)?\w+/.test(_ext.url)) {
                    createAndWriteFile(_ext.url, data.cmpData);
                } else {
                    res.send(200, {}, {
                        code: -2,
                        message: "组件路径不合法"
                    });
                }

            }
            res.send(200, {}, {
                code: "0",
                message: _ext.url + "写入成功"
            });

        } else {
            res.send(200, {}, {
                code: -1,
                message: "校验失败"
            });
        }
    });
    this.post(/^ajax\/(.*)$/).bind(function (req, response, id, data) {
        if (id == "pool-component") {
            readDir(currentDir, poolCompConfig.rule, poolCompConfig.path, function (result) {
                let promise = new Promise(function (resolve, reject) {
                    resolve([]);
                });
                result.forEach((item) => {
                    promise = promise.then(function (res) {
                        return handleComponent(res, item, poolCompConfig.tpl)
                    }, function () {});

                });
                promise.then(function (res) {
                    response.send(200, {}, res)
                });

            });
        } else if (id == "page-component") {
            readDir(currentDir, pageCompConfig.rule, pageCompConfig.path, function (result) {
                let promise = new Promise(function (resolve, reject) {
                    resolve([]);
                });
                result.forEach((item) => {
                    promise = promise.then(function (res) {
                        return handleComponent(res, item, pageCompConfig.tpl)
                    }, function () {});

                });
                promise.then(function (res) {
                    response.send(200, {}, res)
                });

            });
        } else if (id == "common-component") {
            readDir(currentDir, commonCompConfig.rule, commonCompConfig.path, function (result) {
                let promise = new Promise(function (resolve, reject) {
                    resolve([]);
                });
                result.forEach((item) => {
                    promise = promise.then(function (res) {
                        return handleComponent(res, item, commonCompConfig.tpl)
                    }, function () {});

                });
                promise.then(function (res) {
                    response.send(200, {}, res)
                });

            });
        }
    });
});
/**
 *
 * @param {*} cpath  当前路径
 * @param {*} tpl
 * @param {*} name 当前文件名
 */
function detectComp(_path, tpl, name) {
    var itemStats = fs.statSync(_path);
    var existComp = fs.existsSync(join(_path, "component.js"));
    var existUi = fs.existsSync(join(_path, "ui.js"));

    if (itemStats.isDirectory() && (existComp || existUi)) {
        var webUiPath = _path,
            wapUiPath = join(_path, tpl.dir.ui.wap.file),
            dataPath = _path + tpl.dir.data.file,
            webUi = "",
            wapUi = "",
            ui = "",
            data = "",
            element = "";

        tpl.dir.ui.web.file.forEach((i) => {
            if (fs.existsSync(join(webUiPath, i))) {
                webUi = join(webUiPath, i);
                element = new RegExp(tpl.dir.ui.web.elementRule, 'g').exec(cleanData(fs.readFileSync(webUi, 'utf-8')));
                element = element && element[1]
            }
        })
        if (fs.existsSync(wapUiPath)) {
            wapUi = wapUiPath;
            if (!element) {
                element = new RegExp(tpl.dir.ui.web.elementRule, 'g').exec(cleanData(fs.readFileSync(wapUi, 'utf-8')));
                element = element && element[1]
            }
        }
        if (fs.existsSync(dataPath)) {
            tpl.dir.data.dataRule.forEach((i) => {
                if (!data) {
                    let _d = cleanData(fs.readFileSync(dataPath, 'utf-8'))
                    _d = _d.substring(0, _d.indexOf("init:"))
                    data = new RegExp(i, 'g').exec(_d);
                    data = data && data[1];
                }
            })
        }
    } else if (itemStats.isFile() && name.match("js")) {

        webUi = _path;
        tpl.file.data.dataRule.forEach((i) => {
            if (!data) {
                data = new RegExp(i, 'g').exec(cleanData(fs.readFileSync(webUi, 'utf-8')));
                data = data && data[1];
            }
        })
        element = new RegExp(tpl.file.ui.elementRule, 'g').exec(cleanData(fs.readFileSync(webUi, 'utf-8')));
        element = element && element[1]
    } else {

        if (itemStats.isDirectory()) {
            return "next"
        }
    }
    return {
        "webUiPath": webUi,
        "wapUiPath": wapUi,
        "data": data,
        "name": name,
        "type": "pool",
        "ele": element
    }
}
/**
 * 处理业务通用模块读取
 * @param {*} result
 * @param {*} comp
 * @param {*} tpl
 * @param {*} _cb
 */
function handleFindComponent(cpath, tpl, sub, name, _res) {
    let _comp = detectComp(join(cpath, sub), tpl, name);
    if (_comp == "next") {
        let files = fs.readdirSync(join(cpath, sub));
        files.forEach(function (item) {
            console.log(item)
            handleFindComponent(join(cpath, sub), tpl, item, item, _res)
        });
    } else {
        _comp["ele"] && _res.push(_comp);
    }
    // _res.length && result.push(_res);
    // return Promise.resolve(result)
}

function handlePageComponent(result, comp, tpl, _cb) {
    var _res = [];
    handleFindComponent(comp.path + tpl.subComponentPath, tpl, "", comp.name, _res);
    _res.length && result.push(_res);
    return Promise.resolve(result)
}

/**
 * 处理模块读取
 * @param {*} result
 * @param {*} comp
 * @param {*} tpl
 * @param {*} _cb
 */
function handleComponent(result, comp, tpl, _cb) {
    var _res = [];
    handleFindComponent(comp.path + tpl.subComponentPath, tpl, "", comp.name, _res);
    _res.length && result.push(_res);
    return Promise.resolve(result)
}
// function handleComponent(result, comp, tpl, _cb) {
//     let _res = [];
//     let files = fs.readdirSync(comp.path + tpl.subComponentPath);
//     files.forEach(function (item) {
//         let _comp = detectComp(comp.path + tpl.subComponentPath + item, tpl, item);
//         _comp["compName"] = comp.name;
//         _comp["ele"] && _comp["data"] && _res.push(_comp);

//     });
//     _res.length && result.push(_res);
//     return Promise.resolve(result)
// }

function cleanData(obj) {
    return obj.replace(/ /g, "").replace(/\/\/[\s\S]*?\r/g, "").replace(/\n/g, "").replace(/\r/g, "").replace(/\/\*[\s\S]*?\*\//g, "");
}

function readDir(currentDir, rule, path, _cb) {
    let compPath = currentDir + path;
    let itemStats, result = [];
    fs.readdir(compPath, function (error, files) {
        if (error) {
            _cb("error");
        }
        files.forEach(function (item) {
            itemStats = fs.statSync(compPath + item);
            if (itemStats.isDirectory() && new RegExp(rule).test(item)) {
                result.push({
                    name: item,
                    desc: item,
                    path: join(compPath, item)
                });
            }

        });
        _cb(result);
    });
}

function exec(cmdStr, _cb) {
    var exec = require('child_process').exec;
    exec(cmdStr, function (err, stdout, stderr) {
        _cb && _cb();
    });
}

function handleRequest(request, response) {

    var urlObject = urlParser.parse(request.url, true);
    var pathname = decodeURIComponent(urlObject.pathname);
    console.log('[' + (new Date()).toUTCString() + '] ' + '"' + request.method + ' ' + pathname + '"');
    if (/(api|ajax)/g.test(pathname)) {
        var body = "";
        request.addListener('data', function (chunk) {
            body += chunk
        });
        request.addListener('end', function () {
            //
            // Dispatch the request to the router
            //
            router.handle(request, body, function (result) {
                // response.writeHead(result.status, result.headers);
                response.writeHead(200, {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                    "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS"
                });
                response.end(result.body);
            });
        });

    } else {
        var filePath = "";
        if (pathname.indexOf("cmpApp") >= 0) {
            // currentDir = __dirname;
            // console.log(__dirname);
            // console.log(pathname);
            var _subPath = pathname.substr(pathname.indexOf("cmpApp") + 6);
            // console.log(_subPath);
            //静态文件处理
            // filePath = path.join(__dirname, "../static" + (_subPath == "/" ? "/index.html" : _subPath));
            filePath = join(__dirname, ".." + _subPath);
        } else {
            //静态文件处理
            filePath = join(currentDir, pathname);
        }
        fs.stat(filePath, function (err, stats) {
            if (err) {
                response.writeHead(404, {});
                response.end('File not found!');
                return;
            }
            console.log(stats.isDirectory());
            if (stats.isFile()) {
                fs.readFile(filePath, function (err, data) {
                    if (err) {
                        response.writeHead(404, {});
                        response.end('Opps. Resource not found');
                        return;
                    }

                    if (filePath.indexOf("svg") > 0) {
                        response.writeHead(200, {
                            'Content-Type': 'image/svg+xml; charset=utf-8'
                        });
                    } else {
                        response.writeHead(200, {
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                            "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS"
                        });
                    }
                    response.write(data);
                    response.end();
                });

            } else if (stats.isDirectory()) {
                fs.readdir(filePath, function (error, files) {
                    if (error) {
                        response.writeHead(500, {});
                        response.end();
                        return;
                    }
                    var l = pathname.length;
                    if (pathname.substring(l - 1) != '/') pathname += '/';


                    response.writeHead(200, {
                        'Content-Type': 'text/html'
                    });
                    response.write('<!DOCTYPE html>\n<html><head><meta charset="UTF-8"><title>' + filePath + '</title></head><body>');
                    response.write('<a href="/cmpApp/static/index.html" target="_blank"><h1>&nbsp;&nbsp; Start CmpApp </h1></a>');
                    response.write('<h1>' + filePath + '</h1>');
                    response.write('<ul style="list-style:none;font-family:courier new;">');
                    files.unshift('.', '..');
                    files.forEach(function (item) {

                        var urlpath, itemStats;
                        if (pathname.indexOf("cmpApp") >= 0) {
                            urlpath = pathname.substr(pathname.indexOf("cmpApp") + 6) + item;
                            itemStats = fs.statSync(__dirname + "\\.." + urlpath);
                        } else {
                            urlpath = pathname + item
                            itemStats = fs.statSync(currentDir + urlpath);

                        }

                        if (itemStats.isDirectory()) {
                            urlpath += '/';
                            item += '/';
                        }

                        response.write('<li><a href="' + urlpath + '">' + item + '</a></li>');
                    });

                    response.end('</ul></body></html>');
                });
            }
        });
    }
}
let createServer = function (config) {

    currentDir = config.path || currentDir;
    port = +(config.port || port);
    let server = http.createServer(handleRequest).listen(port);
    // console.log(port);

    require('dns').lookup(require('os').hostname(), function (err, addr, fam) {
        console.log('server Running at http://' + addr + ((port == 80) ? '' : (':' + port)) + '/');
    })
    console.log(!config.start);
    if (config.start == "true") {
        //打开浏览器
        exec("start http://127.0.0.1" + ((port == 80) ? '' : (':' + port)) + '/cmpApp/static/index.html');
    }
    console.log('Base directory at ' + currentDir);
    return server;
}
export default createServer
