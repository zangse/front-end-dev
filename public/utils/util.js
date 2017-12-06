/**
 * [util 工具类集合]
 * @type {Object}
 */
var util = {};
/**
 * @description [ajax请求创建过程]
 * @DateTime    2017-12-06
 * @Author      zangse
 * @param       {[object]}      params [description]
 * @return      {[type]}             [description]
 */
util.httpRequest = function(params) {
    if (!params.url) {
        return;
    }
    // 获取XHR对象，兼容IE5和IE6(使用ActiveX对象)
    var xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    // 发起请求
    var type = params.type.toUpperCase();
    var data = params.data;
    var url = params.url;
    var dataArr = [];
    var postMap = '';
    for (var k in data) {
        dataArr.push(k + '=' + data[k]);
    }
    postMap = dataArr.join('&');
    if (type === 'GET') {
        url = url + '?' + postMap;
        xhr.open(type, url.replace(/\?$/g, ''), true);
        xhr.send();
    }
    if (type === "POST") {
        xhr.open(type, url, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send(postMap);
    }
    xhr.onload = function() {
        if (xhr.status === 200 || xhr.status === 304) {
            var res;
            if (params.success && params.success instanceof Function) {
                res = xhr.responseText;
                if (typeof res === 'string') {
                    res = JSON.parse(res);
                    params.success.call(xhr, res);
                }
            }
        } else {
            if (params.error && params.error instanceof Function) {
                params.error.call(xhr, 'error')
            }
        }
    }
}
/**
 * [function 判断是否为函数]
 * @param  {[type]} source [description]
 * @return {[type]}        [description]
 */
util.isFunction = function(source) {
    return '[object Function]' === Object.prototype.toString.call(source);
};
/**
 * @description 创建script标签
 * @DateTime    2017-12-06
 * @Author      zangse
 * @return      {[type]}   [description]
 */
util.createScript = function(url) {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', url);
    script.async = true;
    return script;
}
/**
 * @description [使用jsonp实现跨域访问]
 * @DateTime    2017-12-06
 * @Author      zangse
 * @return      {[type]}   [description]
 */
util.jsonp = function(url, onsuccess, onerror) {
    var callbackName = "jsonp";
    window[callbackName] = function() {
        if (onsuccess && util.isFunction(onsuccess)) {
            onsuccess(arguments[0]);
        }
    };
    var script = util.createScript(url + '?&callback=' + callbackName);
    script.onload = script.onreadystatechange = function() {
        if (!script.readyState || /loaded|complete/.test(script.readyState)) {
            script.onload = script.onreadystatechange = null;
            // 移除该script的 DOM 对象
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
            // 删除函数或变量
            window[callbackName] = null;
        }
    };
    script.onerror = function() {
        if (onerror && util.isFunction(onerror)) {
            onerror('error');
        }
    };
    document.getElementsByTagName('head')[0].appendChild(script);
}

util.webSocket = function(url) {
    var ws = new WebSocket(url);

    ws.onopen = function(evt) {
        console.log("Connection open ...");
        ws.send("Hello WebSockets!");
    };

    ws.onmessage = function(evt) {
        console.log("Received Message: " + evt.data);
        ws.close();
    };

    ws.onclose = function(evt) {
        console.log("Connection closed.");
    };
}