/*
 * HTML5 application library
 * Copyright (c) 2012-2016 Alexander Melanchenko
 * http://alexnd.com
 * Released under the MIT License
 */

var lib = (function ($g) {

  var self = this;

  $g.inject = function (dst, src) {
    try {
      if (!('object' == typeof dst && null !== dst)) var dst = {};
      if ('object' == typeof src && null !== src) for (var p in src) {
        if ('function' == typeof src.hasOwnProperty && !src.hasOwnProperty(p)) continue;
        dst[p] = src[p];
      }
      if (arguments.length > 2) {
        for (var i = 2; i < arguments.length; i++) {
          if ('object' == typeof arguments[i] && null !== arguments[i]) for (var p in arguments[i]) {
            if ('function' == typeof arguments[i].hasOwnProperty && !arguments[i].hasOwnProperty(p)) continue;
            dst[p] = arguments[i][p];
          }
        }
      }
      return dst;
    } catch (e) {
      return null;
    }
  };

  $g.serialize = function(obj, prefix) {
    var str = [];
    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        var k = prefix ? prefix + '[' + p + ']' : p,
          v = obj[p];
        str.push(typeof v == 'object' ? $g.serialize(v, k) : encodeURIComponent(k) + '=' + encodeURIComponent(v));
      }
    }
    return str.join('&');
  };

  $g.copy = function(src, isown) {
      var dest = {};
      if('object'==typeof src) for (var p in src) {
      if (undefined!==isown && isown && undefined!==src['hasOwnProperty'] && !src.hasOwnProperty(p)) continue;
      dest[p] = src[p];
    }
    return dest;
  };

  /**
  * c - Child
  * p - Parent
   function Parent() {}
   function Child() {}
   $g.inherit(Child, Parent);
   var kid = new Child();
  **/
  $g.inherit = (function () {
      var f = function(){};
      return function(c, p) {
          f.prototype = p.prototype;
          c.prototype = new f();
          c._super = p.prototype;
          c.prototype.constructor = c;
      }
  }());

  $g.empty = function (v) {
    try {
      if (!v) return true;
      if (v instanceof Array) return ( v.length == 0 );
      if (v instanceof Object) {
        for (var i in v) {
          if (v.hasOwnProperty(i)) return false;
        }
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  $g.to_str = Object.prototype.toString;

  $g.is_str = function (s) {
    return typeof s === 'string';
  };

  $g.is_arr = function (a) {
    return $g.to_str.call(a) === '[object Array]';
  };

  $g.is_obj = function (v) {
    return v !== null && typeof v === 'object';
  };

  $g.is_el = function (el) {
    return ($g.is_obj(el) && undefined !== el['nodeType']);
  };

  $g.is_num = function (v) {
    return typeof v === 'number';
  };

  $g.is_fun = function (v) {
    return typeof v === 'function';
  };
  $g.is_func = $g.is_fun;

  $g.is_null = function (v) {
    return v === null;
  };

  $g.to_int = function (s) {
    var n = parseInt(s, 10);
    return n === null || isNaN(n) ? 0 : n;
  };
  $g.parse_num = $g.to_int;

  $g.to_float = function (v) {
    var n = parseFloat(v);
    return n === null || isNaN(n) ? 0 : n;
  };

  $g.is_url = function(v) {
    return ($g.is_str(v) && v.match(/^https?\:\/\/\w+/));
  };

  $g.arr_intersect = function (a, a2) {
    try {
      for (var i = a.length; i--;) {
        for (var j = a2.length; j--;) {
          if (a[i] == a2[j]) return true;
        }
      }
      return false;
    } catch (e) {
      return null
    }
  };

  $g.in_arr = function (a) {
    try {
      for (var i = a.length; i--;) {
        for (var j = 0; j < arguments.length; j++) {
          if (j == 0) continue;
          if (a[i] == arguments[j]) return i;
        }
      }
      return null;
    } catch (e) {
      return null
    }
  };

  $g.arr_trim = function (a) {
    try {
      for (var i = a.length; i--;) {
        if (a[i] === undefined) a.splice(i, 1);
      }
    } catch (e) {
    }
  };

  // Return real var type string representation
  $g.toType = function (ob) {
    return ({}).toString.call(ob).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  };

  // converts float number to string with given precision
  $g.toFixed = function (value, precision) {
    var power = Math.pow(10, precision || 0);
    return String(Math.round(value * power) / power);
  };

  $g.toSource = function (obj, name) {
    try {
      var c = obj.constructor.toString();
      var tmpArr = [];
      var tmpName = ( name ) ? '"' + name + '"' + ':' : "";
      if (c.match(/Object/g)) {
        var tmpOArr = [];
        for (var i in obj) {
          tmpOArr.push($g.toSource(obj[i], i));
        }
        tmpArr.push(tmpName + "{" + tmpOArr.join() + "}");
      }
      if (c.match(/Array/g)) {
        var tmpAArr = [];
        for (var i = 0, l = obj.length; i < l; i++) {
          tmpAArr.push($g.toSource(obj[i]));
        }
        tmpArr.push(tmpName + "[" + tmpAArr.join() + "]");
      }
      else if (c.match(/String/g)) {
        var tmpStr = obj.replace(/(\\)/g, '\\');
        tmpStr = tmpStr.replace(/(")/g, '\\"');
        tmpArr.push(tmpName + '"' + tmpStr + '"');
      }
      else if (c.match(/Number/g)) {
        tmpArr.push(tmpName + obj);
      }
      return tmpArr.join();

    } catch (e) {
    }
  };

  // converts numeric degrees to radians
  $g.toRad = function (a) {
    if (!isNaN(a)) {
      return parseFloat(a) * Math.PI / 180;
    }
    return 0;
  };

  $g.strbool = function (s) {
    return (('string' == typeof s && /^true$/i.test(s)) ? true : false);
  };

  $g.trim_str = function (s) {
    return s.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
  };

  // Returns a random number between min and max
  $g.rnd_a = function (min, max) {
    return Math.random() * (max - min) + min;
  };

  // Returns a random integer between min and max
  // Using Math.round() will give you a non-uniform distribution!
  $g.rnd_i = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  $g.rnd_circ = function () {
    var t = 2 * Math.PI * Math.random();
    var u = Math.random() + Math.random();
    var r = (u>1) ? 2-u : u;
    return [r * Math.cos(t), r * Math.sin(t)];
  };

  $g.err = function (s) {
    console.log('Error:', s);
  };

  $g.ts = function () {
    return Date.now();
  };

  $g.tsof = function (x) {
    return $g.ts() + x;
  };

  $g.id = function (s) {
    return document.getElementById(s);
  };

  //var cnv = $g.el('CANVAS', {width:100,height:100,style:'background:#000'});
  $g.el = function (tag) {
    var el = document.createElement(tag);
    if (tag.toUpperCase() === 'CANVAS' && 'undefined' != typeof window.G_vmlCanvasManager) {
      G_vmlCanvasManager.initElement(el);
    }
    if (arguments.length > 1 && 'object' == typeof arguments[1]) {
      for (var i in arguments[1]) {
        if ('object' == typeof arguments[1][i]) {
          for (var j in arguments[1][i]) {
            el[i][j] = arguments[1][i][j];
          }
        } else {
          el.setAttribute(i, arguments[1][i]);
        }
      }
    }
    if (arguments.length > 2 && null !== arguments[2]) {
      if (tag.match(/^INPUT|TEXTAREA$/i))
        el.value = arguments[2];
      else
        el.innerHTML = arguments[2];
    }
    if (arguments.length > 3) {// && 'object' == typeof arguments[3]
      $g.inject(el.style, arguments[3]);
    }
    return el;
  };

  $g.qs = function (s) {
    if (arguments.length > 1)
      return s.querySelector(arguments[1]);
    else
      return document.querySelector(s);
  };

  $g.qsa = function (s) {
    if (arguments.length > 1)
      return s.querySelectorAll(arguments[1]);
    else
      return document.querySelectorAll(s);
  };

  $g.add = function (p, el) {
    p.appendChild(el);
  };

  $g.addBefore = function (p, el) {
    return p.insertBefore(el, p.firstChild);
  };

  // adds DOM node to the end after referenced one
  $g.addAfter = function (parent, node, referenceNode) {
    parent.insertBefore(node, referenceNode.nextSibling);
  };

  $g.rm = function (el) {
    el.parentNode.removeChild(el);
  };

  $g.isChildOf = function (child, parent) {
    var node = child.parentNode;
    while (node != null) {
      if (node == parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  };

  $g.cn = function (el, t) {
    return el.getElementsByTagName(t).item(0);
  };

  $g.cns = function (el, t) {
    return el.getElementsByTagName(t);
  };

  $g.ptn = function (node, nodeName) {
    try {
      var node = (($g.is_str(node)) ? $g.id(node) : node);
      while (node.parentNode && node.parentNode.nodeName != nodeName) {
        node = node.parentNode;
      }
      if (!node.parentNode) return;
      return node.parentNode;
    } catch (e) {
      return;
    }
  };

  $g.pcn = function (node, className) {
    try {
      var node = (($g.is_str(node)) ? $g.id(node) : node);
      while (node.parentNode && !$g.match_class(node.parentNode, className)) {
        node = node.parentNode;
      }
      if (!node.parentNode) return;
      return node.parentNode;
    } catch (e) {
      return;
    }
  };

  $g.match_class = function (node, className) {
    try {
      var node = ($g.is_str(node)) ? $g.id(node) : node;
      var classArr = node.className.split(/\s+/i);
      for (var i = classArr.length; i-- > 0;) {
        if (classArr[i] == className) return true;
      }
      return false;
    } catch (e) {
      return;
    }
  };

  $g.set_class = function (node, className, state) {
    try {
      var node = ($g.is_str(node)) ? $g.id(node) : node;
      var classArr = node.className.split(/\s+/i);
      for (var i = classArr.length; i-- > 0;) {
        if (classArr[i] == className) {
          if (state) return;
          if (!state) {
            classArr.splice(i, 1);
            node.className = classArr.join(' ');
            return;
          }
        }
      }
      if (state) {
        classArr.push(className);
        node.className = classArr.join(' ');
      }
    } catch (e) {
    }
  };

  $g.set_classes = function (node, classNamesStates) {
    try {
      if ($.is_str(node)) node = $.id(node);
      if ($.is_el(node)) {
        var classArr = node.className.split(/\s+/i), i, j, s;
        for (j in classNamesStates) {
          s = 0;
          for (i = 0; i < classArr.length; i++) {
            //console.log('classArr['+i+']='+classArr[i], j+'='+classNamesStates[j]);
            if (!classNamesStates[j]) {
              s = 1;
              if (classArr[i] == j) {
                //console.log('deleting class', j);
                classArr.splice(i, 1);
              }
              break;
            }
            else if (classArr[i] == j) s = 1;
          }
          if (!s && classNamesStates[j]) classArr.push(j);
        }
        node.className = classArr.join(' ');
      }
    } catch (e) {
    }
  };

  $g.get_css_selector = function (className) {
    var r, classes = document.styleSheets[0].rules || document.styleSheets[0].cssRules;
    for (var x = 0; x < classes.length; x++) {
      if (classes[x].selectorText == className) {
        r = (classes[x].cssText) ? classes[x].cssText : classes[x].style.cssText;
      }
    }
    return r;
  };

  $g.txt = function (el) {
    return el.innerText || el.textContent || '';
  };

  $g.first_el = function (node) {
    try {
      for (var i = 0, l = node.childNodes.length; i < l; i++) {
        if (node.childNodes[i].nodeType == $g.NODE_ELEMENT) return node.childNodes[i];
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  $g.next_by_tag = function (node, nodeName) {
    try {
      while (node.nextSibling) {
        if (node.nextSibling.nodeName == nodeName) return node.nextSibling;
        node = node.nextSibling;
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  $g.prev_by_tag = function (node, nodeName) {
    try {
      while (node.previousSibling) {
        if (node.previousSibling.nodeName == nodeName) return node.previousSibling;
        node = node.previousSibling;
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  $g.has_atr = function (el, n) {
    return ( el.hasAttribute(n) );
  };

  $g.body = function () {
    return document.getElementsByTagName('body')[0];
  };

  $g.d2c = function (el) {
    return ($g.is_el(el) ? el.getContext('2d') : null);
  };

  /*
   params:
   elementNode - dom node
   eventName - string event name
   callback - function
   useCapture - bool (true - capturing, false - bubbling)
   example:
   $g.event( , 'click', function(e){
   if (!e) var e = window.event;
   $g.prevent(e);
   //do work...
   return false;
   });
   */
  $g.event = function (el, ev, cb, cap) {
    if (!el) return;
    if (el.addEventListener) {
      el.addEventListener(ev, cb, ((undefined === cap) ? false : cap));
    }
    //FIXME?
    else if (el.attachEvent) {
      //el.attachEvent('on' + ev, cb);
      el.attachEvent('on' + ev, function () {
        cb.call(event.srcElement, event);
      });
    }
    else {
      el['on' + ev] = cb
    }
  };

  $g.unevent = function (el, ev, cb, cap) {
    if (el && el.removeEventListener) {
      try {// FF issue
        el.removeEventListener(ev, cb, ((undefined === cap) ? false : cap));
      } catch (_) {
      }
    } else if (el && el.detachEvent) {
      el.detachEvent('on' + ev, cb);
    } else if (el) {
      if (undefined !== el['on' + ev]) {
        //delete el['on' + ev];
        el['on' + ev] = null;
      }
    }
  };

  $g.prevent = function (ev) {
    if (!ev) return;
    ev.cancelBubble = true;
    ev.returnValue = false;
    if (ev.stopPropagation) ev.stopPropagation();
    if (ev.preventDefault) ev.preventDefault();
  };

  $g.eventTarget = function (e) {
    var trg;
    if (e.target) trg = e.target;
    else if (e.toElement) trg = e.toElement;
    else if (e.currentTarget) trg = e.currentTarget;
    else if (e.srcElement) trg = e.srcElement;
    else trg = e;
    return trg;
  };

  $g.eventSource = function (e) {
    var trg;
    if (e.currentTarget) trg = e.currentTarget;
    else if (e.srcElement) trg = e.srcElement;
    else if (e.target) trg = e.target;
    else if (e.toElement) trg = e.toElement;
    else trg = e;
    return trg;
  };

  $g.mousepos = function (e) {
    if (e.pageX || e.pageY) {
      return {x: e.pageX, y: e.pageY};
    }
    return {
      x: e.clientX + document.body.scrollLeft - document.body.clientLeft,
      y: e.clientY + document.body.scrollTop - document.body.clientTop
    }
  };

  $g.cookie = {
    create: function (name, value, days) {
      if (typeof days !== 'number' || typeof name !== 'string' || typeof value !== 'string') {
        return false;
      }
      var date = new Date();
      date.setTime(date.getTime() + (days * 86400000));
      document.cookie = name + '=' + value + '; expires=' + date.toGMTString() + '; path=/';
    },
    read: function (name) {
      var cookie = document.cookie,
        i, val = false;
      cookie = cookie.split(';');
      for (i = 0; i < cookie.length; i++) {
        if (cookie[i].indexOf(name) !== -1) {
          while (cookie[i].indexOf(name) > 0 && cookie[i].length > name.length) {
            cookie[i] = cookie[i].substr(1);
          }
          val = cookie[i].substr(name.length + 1);
        }
      }
      return val;
    },
    erase: function (name) {
      this.create(name, '', -1);
    }
  };

  $g.xhr = function () {
    var ref = null;
    if (window.XMLHttpRequest) {
      ref = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      try {
        ref = new ActiveXObject('Msxml2.XMLHTTP.6.0');
      } catch (e) {
      }
      try {
        ref = new ActiveXObject('Msxml2.XMLHTTP.3.0');
      } catch (e) {
      }
      try {
        ref = new ActiveXObject('Microsoft.XMLHTTP');
      } catch (e) {
      }
      //throw new Error('This browser does not support XMLHttpRequest.');
    }
    return ref;
  };

  $g.sendfile = function (url, file, varname, filename, extravars, load_img_back, cb, formEl) {
    var xhr = $g.xhr();
    if (undefined !== formEl) {
      var fd = new FormData(formEl);
    } else {
      var fd = new FormData();
    }
    xhr.open('POST', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        if (xhr.responseText != '') {
          if (undefined !== load_img_back && load_img_back) {
            var img = new Image();
            if ('function' == typeof cb) {
              img.onload = function () {
                cb.call(this, img);
              }
            }
            img.src = xhr.responseText;
          } else {
            if ('function' == typeof cb) {
              cb.call(this, xhr.responseText, xhr);
            }
          }
        }
      }
    };
    if (undefined !== filename) {
      fd.append(varname, file, filename);
    } else {
      fd.append(varname, file);
    }
    if ('object' == typeof extravars) {
      for (var i in extravars) {
        fd.append(i, extravars[i]);
      }
    }
    xhr.send(fd);
  };

  $g.set_xhr_post = function (xhr) {
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    if (arguments.length > 1) xhr.setRequestHeader('Content-length', arguments[1].length);
    xhr.setRequestHeader('Connection', 'close');
  };

  $g.set_headers = function (xhr, hdrs) {
    for(var x in hdrs) {
      xhr.setRequestHeader(x, hdrs[x]);
    }
  };

  // local storage

  $g.save_ls = function (k, v) {
    if (undefined !== k && undefined !== v) {
      if ('object' == typeof v) localStorage.setItem(k, JSON.stringify(v));
      else localStorage.setItem(k, v);
    }
  };

  $g.unset_ls = function (k) {
    localStorage.setItem(k, null);
  };

  $g.load_ls = function (k) {
    return localStorage.getItem(k);
  };

  $g.load_bool_ls = function (k) {
    var s = $g.load_ls(k);
    return $g.strbool(s);
  };

  $g.load_int_ls = function (k) {
    var s = $g.load_ls(k);
    return ((s !== null && !isNaN(s)) ? $g.to_int(s) : 0);
  };

  $g.load_float_ls = function (k) {
    var s = $g.load_ls(k);
    return ((s !== null && !isNaN(s)) ? parseFloat(s) : 0.0);
  };

  $g.load_obj_ls = function (k) {
    var s = $g.load_ls(k);
    return ((s !== null && s.indexOf('{') == 0) ? JSON.parse(s) : {});
  };

  $g.load_arr_ls = function (k) {
    var s = $g.load_ls(k);
    return ((s !== null && s.indexOf('[') == 0) ? JSON.parse(s) : []);
  };

  $g.is_ls = function (k) {
    return (undefined !== k && null !== localStorage.getItem(k));
  };

  $g.json_decode = function(v) {
    try {
      if ('string' == typeof v && (v.indexOf('{') == 0 || v.indexOf('[') == 0)) return JSON.parse(v);
      else {
        var ob = new Object();
        return ob;
      }
    } catch (e) {
      var ob = new Object();
      return ob;
    }
  };

  // format date
  $g.dtformat = function (t) {
    if ('undefined' == typeof t) var t = $g.ts();
    var d = new Date(t), s = ((d.getDate() < 10) ? ('0' + d.getDate()) : d.getDate()) + '.' + $g.months[d.getMonth()] + '.' + d.getFullYear() + '/' +
      ((d.getHours() < 10) ? ('0' + d.getHours()) : d.getHours()) + ':' + ((d.getMinutes() < 10) ? ('0' + d.getMinutes()) : d.getMinutes())
      + ':' + ((d.getSeconds() < 10) ? ('0' + d.getSeconds()) : d.getSeconds());
    return s;
  };

  // convert string DD.MM.YYYY date to unix timestamp (seconds since 1970)
  $g.dt_to_ts = function (s) {
    var p = s.match(/^(\d+)\.(\d+)\.(\d+)$/), d = new Date();
    if (p) {
      d.setFullYear(p[3]);
      d.setMonth(p[2]);
      d.setDate(p[1]);
      d.setHours(0);
      d.setMinutes(0);
      d.setSeconds(0);
      d.setMilliseconds(0);
      return d.getTime();
    }
    return 0;
  };

  // convert string YYYY-MM-DD hh:mm:ss date to unix timestamp (seconds since 1970)
  $g.sqldate_to_ts = function (s) {
    var p = s.match(/^(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)$/), d = new Date();
	if (!p) p = s.match(/^(\d+)-(\d+)-(\d+)$/);
    if (p) {
      d.setFullYear(p[1]);
      d.setMonth(p[2]);
      d.setDate(p[3]);
      if (p.length > 6) {
        d.setHours(p[4]);
        d.setMinutes(p[5]);
        d.setSeconds(p[6]);
      } else {
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
      }
      d.setMilliseconds(0);
      return d.getTime();
    }
    return 0;
  };

  $g.sqldate = function (dt) {
    var s = '';
    if ('undefined'==typeof dt) var dt = new Date();
    else if (!(dt instanceof Date)) dt = new Date(dt);
    s += dt.getFullYear();
    s += '-' + ((dt.getMonth() < 9) ? ('0' + (dt.getMonth()+1)) : (dt.getMonth()+1));
    s += '-' + ((dt.getDate() < 10) ? ('0' + dt.getDate()) : dt.getDate());
    if (arguments.length>1 && arguments[1]) {
      s += ' ' + ((dt.getHours() < 10) ? ('0' + dt.getHours()) : dt.getHours());
      s += ':' + ((dt.getMinutes() < 10) ? ('0' + dt.getMinutes()) : dt.getMinutes());
      s += ':' + ((dt.getSeconds() < 10) ? ('0' + dt.getSeconds()) : dt.getSeconds());
    }
    return s;
  };

  $g.sqltime = function (dt) {
    var s = '';
    if ('undefined'==typeof dt) var dt = new Date();
    else if (!(dt instanceof Date)) dt = new Date(dt);
    s += ((dt.getHours() < 10) ? ('0' + dt.getHours()) : dt.getHours());
    s += ':' + ((dt.getMinutes() < 10) ? ('0' + dt.getMinutes()) : dt.getMinutes());
    s += ':' + ((dt.getSeconds() < 10) ? ('0' + dt.getSeconds()) : dt.getSeconds());
    return s;
  };

  $g.ts_to_sqldate = function(_v) {
    var v = _v || Date.now();
    var d = new Date(v);
    var m = d.getMonth() - 1;
    return d.getFullYear() + '-' +
      ((d.getMonth() + 1 < 10) ? ('0' + (d.getMonth() + 1)) : (d.getMonth() + 1)) + '-' +
      ((d.getDate() < 10) ? ('0' + d.getDate()) : d.getDate()) + ' ' +
      ((d.getHours() < 10) ? ('0' + d.getHours()) : d.getHours()) + ':' +
      ((d.getMinutes() < 10) ? ('0' + d.getMinutes()) : d.getMinutes()) + ':' +
      ((d.getSeconds() < 10) ? ('0' + d.getSeconds()) : d.getSeconds());
  };

  // calculate distance between 2 points
  $g.dist = function (x1, y1, x2, y2) {
    if (!isNaN(x1) || !isNaN(x2) || !isNaN(y1) || !isNaN(y2)) return 0;
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  };

  // is point belongs to polygon
  $g.point_in_poly = function (v, p, is_str, is_verts_arr, p_latlng) {
    if (undefined !== is_str && is_str) v = $g.json_decode(v);
    if (undefined !== p_latlng && p_latlng && $g.is_obj(p)) {
      if (is_verts_arr)
        p = [p.lat, p.lng];
      else
        p = {x:p.lat, y:p.lng};
    }
    var r = 0, n = v.length;
    if (n) {
      v.push(v[0]);
      var vn,
        cn = 0; // the crossing number counter
      // loop through all edges of the polygon
      for (var i=0; i < n; i++) { // edge from V[i]  to V[i+1]
        if (undefined!==is_verts_arr && is_verts_arr) {
          if (((v[i][1] <= p[1]) && (v[i+1][1] > p[1])) // an upward crossing
            || ((v[i][1] > p[1]) && (v[i+1][1] <= p[1]))) { // a downward crossing
            // compute the actual edge-ray intersect x-coordinate
            vt = (p[1] - v[i][1]) / (v[i+1][1] - v[i][1]);
            if (p[0] < v[i][0] + vt * (v[i+1][0] - v[i][0])) // P.x < intersect
              ++cn; // a valid crossing of y=P.y right of P.x
          }
        } else {
          if (((v[i].y <= p.y) && (v[i+1].y > p.y)) // an upward crossing
            || ((v[i].y > p.y) && (v[i+1].y <= p.y))) { // a downward crossing
            // compute the actual edge-ray intersect x-coordinate
            vt = (p.y - v[i].y) / (v[i+1].y - v[i].y);
            if (p.x < v[i].x + vt * (v[i+1].x - v[i].x)) // P.x < intersect
              ++cn; // a valid crossing of y=P.y right of P.x
          }
        }
      }
      r = cn & 1; // 0 if even (out), and 1 if  odd (in)
    }
    return r;
  };

  /* return bounding rectangle of path
   input: [[lat,lng],...] or [{lat,lng},...]
   output:
   north (0)
   west (1) *********{x2,y2} east (3)
   {x1,y1}********
   south (2)
   */
  $g.path_bounds = function (path) {
    var r = [];
    for (var i=0; i<path.length; i++) {
      if (i===0) {
        if ($g.is_arr(path[i])) {
          r.push(path[i][0]); //0: y2 (north)
          r.push(path[i][1]); //1: x1 (west)
          r.push(path[i][0]); //2: y1 (south)
          r.push(path[i][1]); //3: x2 (east)
        } else {
          r = { north: path[i].lat, west: path[i].lng, south: path[i].lat, east: path[i].lng };
        }
      } else {
        if ($g.is_arr(r)) {
          if (path[i][0] < r[0]) r[0] = path[i][0];
          else if (path[i][0] > r[2]) r[2] = path[i][0];
          if (path[i][1] < r[1]) r[1] = path[i][1];
          else if (path[i][1] > r[3]) r[3] = path[i][1];
        } else {
          if (path[i].lat < r.north) r.north = path[i].lat;
          else if (path[i].lat > r.south) r.south = path[i].lat;
          if (path[i].lng < r.west) r.west = path[i].lng;
          else if (path[i].lng > r.east) r.east = path[i].lng;
        }
      }
    }
    return r;
  };

  //calculate center of path using google LatLngBounds
  $g.path_center = function(path, plain) {
    var bounds = new google.maps.LatLngBounds();
    if ($g.is_arr(path) && path.length) {
      for (var i = 0; i < path.length; i++) {
        if ('function'==typeof path[i].lat)
          bounds.extend(new google.maps.LatLng(path[i].lat(), path[i].lng()));
        else
          bounds.extend(new google.maps.LatLng(path[i].lat, path[i].lng));
      }
    } else if (lib.is_obj(path) && !lib.is_arr(path)) {
      path.forEach(function(p) {
        bounds.extend(new google.maps.LatLng(p.lat(), p.lng()));
      });
    } else
      return null;
    var c = bounds.getCenter();
    if (undefined!==plain) {
      if (plain == 2)
        return [c.lat(), c.lng()];
      else if (plain)
        return { lat: c.lat(), lng: c.lng() };
      else
        return c;
    } else
      return c;
  };

  //convert mvcarray of google geoobjects to array of arrays[2] or array of {lat,lng}
  $g.path_plain = function(obj, latlng) {
    var path = [], pp;
    if ('object' == typeof obj && obj !== null) {
      if ('function' == typeof obj.getPath)
        pp = obj.getPath();
      else pp = obj;
      pp.forEach(function(p) {
        if (undefined!==latlng && latlng)
          path.push({lat:p.lat(), lng:p.lng()});
        else
          path.push([p.lat(), p.lng()]);
      });
    }
    return path;
  };

  $g.uid = function () {
    var s = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (s() + s() + '-' + s() + '-' + s() + '-' + s() + '-' + s() + s() + s());
  };

  $g.is_email = function(v) {
    if (undefined === v) return false;
    if (!$g.is_str(v)) return false;
    var r = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return r.test(v);
  };

  //replace http://-like substrings with <a href>'s
  $g.urlify = function (s, blank) {
    return s.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,
      '<a href="$1"' + ((undefined !== blank) ? ' target="blank"' : '') + '>$1</a>');
  };

  // return Dom element width in pixels
  $g.w = function (el) {
    if (!el) return 0;
    if (typeof(el.clip) != 'undefined') {
      return el.clip.width;
    } else {
      if (el.style.pixelWidth) {
        return el.style.pixelWidth;
      } else {
        return el.offsetWidth;
      }
    }
  };

  // return Dom element height in pixels
  $g.h = function (el) {
    if (!el) return 0;
    if (typeof(el.clip) != 'undefined') {
      return el.clip.height;
    } else {
      if (el.style.pixelHeight) {
        return el.style.pixelHeight;
      } else {
        return el.offsetHeight;
      }
    }
  };

  // return Dom element positions {x,y} in pixels
  $g.xy = function (el) {
    var x = 0, y = 0;
    /*while(el && el.tagName != 'BODY') {
     y += el.offsetTop;
     x += el.offsetLeft;
     el = el.offsetParent;
     }*/
    if (el && 'undefined' != typeof el.getBoundingClientRect) {
      var r = el.getBoundingClientRect(),
        scrollTop = document.documentElement.scrollTop ?
          document.documentElement.scrollTop : document.body.scrollTop,
        scrollLeft = document.documentElement.scrollLeft ?
          document.documentElement.scrollLeft : document.body.scrollLeft;
      if (arguments.length > 1 && arguments[1]) {
        x = Math.round(r.left + scrollLeft);
        y = Math.round(r.top + scrollTop);
      } else {
        x = r.left + scrollLeft;
        y = r.top + scrollTop;
      }
    }
    return {'x': x, 'y': y};
  };

  $g.pos = function (el) {
    var p = {'x': 0, 'y': 0};
    while (el) {
      p.x += (el.offsetLeft - el.scrollLeft + el.clientLeft);
      p.y += (el.offsetTop - el.scrollTop + el.clientTop);
      el = el.offsetParent;
    }
    return p;
  };

  $g.scrollPos = function () {
    return ((document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100);
  };

// injects view into DOM placeholder
//example: var view = $g.inflate_view( [ {tag:'CANVAS', atr:{width:100,height:100,style:'background:#000'}} ] );
  $g.inflate_view = function (el, vi, op) {
    var i, j, v, isT, isV, r = [];
    //TODO: work in fr = document.createDocumentFragment() than insert it into el
    if (undefined !== vi && $g.is_obj(vi)) {
      if (!$g.is_arr(vi)) vi = [vi];
      if (undefined !== op && $g.is_obj(op) && undefined !== op['clean'] && op.clean && undefined !== el) {
        if ($g.is_el(el)) el.innerHTML = '';
      }
      if (!$g.is_el(el)) el = document.createDocumentFragment();
      for (i in vi) {
        v = null;
        isT = false;
        isV = false;
        if (undefined !== vi[i]['el'] && $g.is_el(vi[i].el)) {
          if (undefined !== op && undefined !== op.dir && op.dir === 'before') {
            el.parentNode.insertBefore(vi[i].el, el);
          } else if (undefined !== op && undefined !== op.dir && op.dir === 'after') {
            el.parentNode.insertBefore(vi[i].el, el.nextSibling);
          } else {
            el.appendChild(vi[i].el);
          }
          vi[i]['skip_c'] = true;
        }
        if (undefined !== vi[i]['html']) {
          if ($g.is_str(vi[i].html)) {
            if ($g.is_el(el)) el.innerHTML += vi[i].html;
            else {
              v = $g.el('DIV');
              v.innerHTML = vi[i].html;
            }
            vi[i]['skip_c'] = true;
          }
        }
        if (undefined === vi[i]['skip_c'] || (undefined !== vi[i].skip_c && vi[i].skip_c)) {
          if ('undefined' != typeof vi[i].ref) {
            v = $g.id(vi[i].ref);
            if (null !== v && null !== v.tagName.match(/^INPUT|TEXTAREA$/i)) isV = true;
          } else if ('string' == typeof vi[i].tag) {
            v = $g.el(vi[i].tag);
            if (null !== vi[i].tag.match(/^INPUT|TEXTAREA$/i)) isV = true;
            if (vi[i].tag.match(/^SELECT$/i) && undefined !== vi[i]['options']) {
              var okey, oval, oel;
              for (j = 0; j < vi[i].options.length; j++) {
                for (okey in vi[i].options[j]) {
                  oval = vi[i].options[j][okey];
                  break;
                }
                oel = $g.el('OPTION', {value: okey}, oval);
                //oel.value = okey;
                if (undefined !== vi[i]['selected'] && vi[i].selected == okey) oel.selected = true;
                v.appendChild(oel);
              }
            }
          } else if ('string' == typeof vi[i].txt) {
            v = document.createTextNode(vi[i].txt);
            isT = true;
          }
          if (v && !isT) { // workaround for google maps api
            if (null !== vi[i].tag.match(/^CANVAS$/i) && 'undefined' != typeof G_vmlCanvasManager)
              G_vmlCanvasManager.initElement(v);
          }
          if (v && 'object' == typeof vi[i].atr) {
            for (j in vi[i].atr) {
              v.setAttribute(j, vi[i].atr[j]);
              if (null !== j.match(/^SC$/i) && 'object' == typeof SC) SC.setSC(v, vi[i].atr[j]);
            }
          }
          if (v && 'object' == typeof vi[i].css) {
            for (j in vi[i].css) {
              v.style[j] = vi[i].css[j];
            }
          }
          if (v && 'object' == typeof vi[i].evn) {
            for (j in vi[i].evn) {
              $g.event(v, j, vi[i].evn[j]);
            }
          }
          if ('string' == typeof vi[i].txt && !isT) {
            if (v) {
              if (isV) v.value = vi[i].txt;
              else v.innerHTML = vi[i].txt;
            }
            else {
              if (null !== el.tagName.match(/^INPUT|TEXTAREA$/i)) el.value = vi[i].txt;
              else el.innerHTML = vi[i].txt;
            }
          }
          //TODO: ignore TextNode childs ?
          if (v && 'object' == typeof vi[i].ch && !isT) {
            $g.inflate_view(v, vi[i].ch);
          }
          if ('object' == typeof vi[i]['layers'] && !isT) {
            for (j = vi[i].layers.n - 1; j >= 0; j--) {
              var rr = $g.inflate_view(el, [{
                tag: 'CANVAS',
                atr: {'id': vi[i].layers.ns + j, width: vi[i].layers.w, height: vi[i].layers.h, style: 'display:none'}
              }]);
              if ('function' == typeof vi[i]['layers_ini']) {
                vi[i].layers_ini.call(this, rr[0], j);
              }
            }
          }
          if ($g.is_el(el) && $g.is_el(v)) {
            if (undefined !== op && undefined !== op.dir && op.dir === 'before') {
              el.parentNode.insertBefore(v, el)
            } else if (undefined !== op && undefined !== op.dir && op.dir === 'after') {
              el.parentNode.insertBefore(v, el.nextSibling);
            } else if (undefined !== op && undefined !== op.dir && op.dir === 'begin') {
              el.insertBefore(v, el.firstChild);
            } else {
              el.appendChild(v);
            }
          }
          //TODO: need pause after appendChild() ?
        }
        //if($g.is_el(v))
        r[i] = v;
        /*if(null===v) {
         if('undefined' != typeof vi[i].ref) {
         v = $g.id(vi[i].ref);
         } else {
         v = el;
         }
         }*/
        if ('function' == typeof vi[i].ini) {
          vi[i].ini.call(this, v, vi[i], i, el);
        }
      }
    }
    return r;
  };

  $g.serialize_view = function (el, ops) {
    var r = {}, ops = ops || {};
    if ('object' == typeof el) {
      if (el.nodeType == $g.NODE_ELEMENT) {
        r['tag'] = el.nodeName;
        r['atr'] = {};
        if (undefined !== el['className'] && el.className.length) r.atr['class'] = el.className;
        if (undefined !== el['id'] && el.id.length) r.atr['id'] = el.id;
        if ('object' == typeof ops['styles']) {
          r.atr['style'] = {};
          for (var i in ops.styles) {
            if (undefined !== el.style[i]) r.atr.style[ops.styles[i]] = el.style[i];
          }
        }
        if (r.tag.match(/^CANVAS$/i)) {
          r.atr['width'] = el.width;
          r.atr['height'] = el.height;
        }
        if (el.hasChildNodes()) {
          r['ch'] = [];
          for (var i in el.childNodes) {
            if (!(el.childNodes[i].nodeType == $g.NODE_ELEMENT || el.childNodes[i].nodeType == $g.NODE_TEXT)) continue;
            var c = $g.serialize_view(el.childNodes[i]);
            if (!$g.empty(c)) r['ch'].push(c);
          }
        } else {
          var t = '' + el.innerHTML;
          if (!t.length) t = $g.txt(el);
          if (t.length) r['txt'] = t;
        }
      } else if (el.nodeType == $g.NODE_TEXT) {
        var t = '' + el.nodeValue;
        t = t.trim();
        if (t.length) r['txt'] = t;
      }
    }
    return r;
  };

// loading media

  //hash of image objects {'path' : Image}
  if ('object' != typeof $g.imgs) $g.imgs = {};
  if ('object' != typeof $g.cnvs) $g.cnvs = {};
  if ('object' != typeof $g.snds) $g.snds = {};

  $g.load_img = function (url, id, cb, args) {
    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
      if ('function' == typeof cb) {
        if (undefined !== args) {
          cb.call(this, img, id, args, url);
        } else {
          cb.call(this, img, id, null, url);
        }
      }
      // remove event and self to prevent IE on animated gif loops and clear up garbage
      if (img) img = img.onload = img.onabort = img.onerror = null;
    }
    img.src = url;
    if ('object' != typeof $g.imgs) $g.imgs = {};
    if (!id) id = url;
    $g.imgs[id] = img;
  };

  $g.load_cnv = function (url, id, cb, args) {
    $g.load_img(url, id, function (img) {
      //console.log('load_img', img.width, img.height);
      var c;
      if ('object' == typeof args && args.hasOwnProperty('c')) {
        c = args.c;
//            console.log('c from args', url);
      } else {
        c = $g.el('canvas');
//            console.log('c local created', url);
      }
      var dc = $g.d2c(c);
      c.width = img.width;
      c.height = img.height;
      dc.drawImage(img, 0, 0);
      if (undefined === args || (undefined !== args && 'undefined' == typeof args['no_cnvs'])) $g.cnvs[id] = c;
      if ('function' == typeof cb) {
        if (undefined !== args) {
          cb.call(this, c, id, args, url);
        } else {
          cb.call(this, c, id, null, url);
        }
      }
    }, args, url);
  };

  $g.load_snd = function (url, id) {
    if ('undefined' != typeof Audio) {
      if (undefined === id) id = url;
      else if (null === id) id = url;
      else if ('' == id) id = url;
      $g.snds[id] = new Audio(url);
    }
    //log('Audio', $g.snds[id]);
  };

  $g.load_js = function (uri, onsuccess, onerror, _context, args) {
    var el = $g.el('SCRIPT');
    if (undefined === _context) var _context = window;
    else if (!_context) _context = window;
    var a = Array.prototype.slice.call(arguments);
    a.push(uri);
    if (undefined !== args) {
      if (!$g.is_arr(args)) args = [args];
      a = a.concat(args);
    }
    if ($g.ie) {
      //TODO: how to implement onerror for IE<=10?
      $g.event(el, 'readystatechange', function () {
        //console.log('readystatechange', this.readyState, this.status);
        if (this.readyState == 'loaded' || this.readyState == 'completed') {
          //$g.event(el, 'readystatechange', function() {
          //    if(this.readyState=='completed') {
          onsuccess.apply(_context, a);
          //    }
          //});
        }
      });
    } else {
      /*$g.event(el, 'load', function() {
       onsuccess.apply(_context, a);
       });
       $g.event(el, 'error', function() {
       onerror.apply(_context, a);
       });*/
      if ($g.is_fun(onsuccess)) $g.event(el, 'load', onsuccess);
      if ($g.is_fun(onerror)) $g.event(el, 'error', onerror);
    }
    if (-1 != uri.search(/^https?\:\/\//i) || 0 == uri.indexOf('/') || 0 == uri.indexOf('.')) {
      el.src = uri;
    } else {
      el.src = '/js/' + uri + '.js';
    }
    document.getElementsByTagName('head')[0].appendChild(el);
  };

  $g.load_css = function (uri) {
    var el = $g.el('LINK');
    el.type = 'text/css';
    el.rel = 'stylesheet';
    if (-1 != uri.search(/^https?\:\/\//i) || 0 == uri.indexOf('/')) {
      el.href = uri;
    } else {
      var p1 = /^\//, p2 = /\.css$/;
      if (!p1.test(uri)) {
        uri = '/css/' + uri;
      }
      if (!p2.test(uri)) {
        uri += '.css';
      }
      el.href = uri;
    }
    document.getElementsByTagName('head')[0].appendChild(el);
  };


  //TODO: synchronous loop (start loading each next resource on load callback) ?
  $g.load_assets = function (a) {
    var r,
      imgdir = ('undefined' == typeof $g.imgpath) ? '/img/' : $g.imgpath,
      snddir = ('undefined' == typeof $g.sndpath) ? '/media/' : $g.sndpath;
    if ($g.is_obj(a) && !$g.is_arr(a)) {
      $g._load_a = [];
      if (undefined !== a.js) {
        if ($g.is_arr(a.js)) $g._load_a.concat(a.js);
        else if ($g.is_str(a.js)) $g._load_a.push(a.js);
      }
      if (undefined !== a.css) {
        if ($g.is_arr(a.css)) $g._load_a.concat(a.css);
        else if ($g.is_str(a.css)) $g._load_a.push(a.css);
      }
      if (undefined !== a.img) {
        if ($g.is_arr(a.img)) $g._load_a.concat(a.img);
        else if ($g.is_str(a.img)) $g._load_a.push(a.img);
      }
      if (undefined !== a.cnv) {
        if ($g.is_arr(a.cnv)) $g._load_a.concat(a.cnv);
        else if ($g.is_str(a.cnv)) $g._load_a.push(a.cnv);
      }
      if (undefined !== a.snd) {
        if ($g.is_arr(a.snd)) $g._load_a.concat(a.snd);
        else if ($g.is_str(a.snd)) $g._load_a.push(a.snd);
      }
    }
    $g._load_i = 0;
    $g._load_timer = setInterval(function () {
      if ($g._load_i >= $g._load_a.length) {
        clearInterval($g._load_timer);
        if ($g._load_vis && $g.id($g._load_el)) {
          $g.id($g._load_el).style.display = 'none';
        }
        if ('function' == typeof $g.on_load_assets) $g.on_load_assets.call(null);
      }
    }, 100);
    if ($g.is_arr(a)) {
      $g._load_a = a;
      for (var i in a) {
        // images
        r = a[i].match(/(.+)\.(gif|jpg|jpeg|png)$/i);
        if (r !== null && r.length > 2) {
          if (0 == a[i].indexOf('*')) {
            //url, id, cb, args
            $g.load_cnv(imgdir + a[i].substr(1), r[1].substr(1), function (cnv, id, args, url) {
              if (!cnv) return null;
              $g._on_load_asset(url);
            });
          } else {
            //url, id, cb, args
            $g.load_img(imgdir + a[i], r[1], function (img, id, args, url) {
              if (!img) return null;
              $g._on_load_asset(url);
            });
          }
        } else {
          // sounds
          r = a[i].match(/(.+)\.(wav|ogg|mp3|mid)$/i);
          if (r !== null && r.length > 2) {
            $g.load_snd(snddir + a[i], r[1]);
            $g._on_load_asset(a[i]);
          } else {
            // javascripts
            if (-1 != a[i].search(/.+\.js$/i)) {
              $g.load_js(a[i], function () {
                $g._on_load_asset(a[i]);
              }, function () {
                $g._on_load_asset(a[i]);
              });
            } else {
              // css
              if (-1 != a[i].search(/.+\.css$/i)) {
                $g.load_css(a[i]);
                $g._on_load_asset(a[i]);
              }
            }
          }
        }
      }
    } else if ($g.is_obj(a)) {
      if (undefined !== a.js) {
        if ($g.is_arr(a.js)) for (var i = 0; i < a.js.length; i++) {
          $g.load_js(a.js[i], function () {
            $g._on_load_asset(a.js[i]);
          }, function () {
            $g._on_load_asset(a.js[i]);
          });
        }
        else if ($g.is_str(a.js)) {
          $g.load_js(a.js, function () {
            $g._on_load_asset(a.js);
          }, function () {
            $g._on_load_asset(a.js);
          });
        }
      }
      // a.css
      if (undefined !== a.css) {
        if ($g.is_arr(a.css)) for (var i = 0; i < a.css.length; i++) {
          $g.load_css(a.css[i]);
          $g._on_load_asset(a.css[i]);
        }
        else if ($g.is_str(a.css)) {
          $g.load_css(a.css);
          $g._on_load_asset(a.css);
        }
      }
      if (undefined !== a.css_inline && $g.is_arr(a.css_inline)) {
        try {
          var ss = Array.prototype.slice.call(document.styleSheets);
          if (ss.length) {
            var b = [].concat(a.css_inline);
            for (var i = 0; i < ss.length; i++) {
              if (undefined === css.cssRules) continue;
              var rules = Array.prototype.slice.call(css.cssRules);
              for (var j = 0; j < rules.length; j++) {
                if (undefined === rules[j].cssRule) continue;
                if (undefined === rules[j].cssRule.cssText) continue;
                for (var k = 0; k < b.length; k++) {
                  if (b[k] == rules[j].cssRule.cssText) b.splice(k, 1);
                }
              }
            }
            $g.add_css(b);
          } else $g.add_css(a.css_inline);
        } catch (_) {
          err('error in $g.load_assets', _);
        }
      }
      // a.img
      if (undefined !== a.img) {
        if ($g.is_arr(a.img)) for (var i = 0; i < a.img.length; i++) {
          r = a.img[i].match(/(.+)\.(gif|jpg|jpeg|png)$/i);
          r = ((!(r !== null && r.length > 2)) ? r[1] : a.img[i]);
          $g.load_img(a.img[i], r, function (img, id, args, url) {
            $g._on_load_asset(url);
          });
        }
        else if ($g.is_str(a.img)) {
          r = a.img.match(/(.+)\.(gif|jpg|jpeg|png)$/i);
          r = ((!(r !== null && r.length > 2)) ? r[1] : a.img);
          $g.load_img(a.img, r, function (img, id, args, url) {
            $g._on_load_asset(url);
          });
        }
      }
      // a.cnv
      if (undefined !== a.cnv) {
        if ($g.is_arr(a.cnv)) for (var i = 0; i < a.cnv.length; i++) {
          r = a.img[i].match(/(.+)\.(gif|jpg|jpeg|png)$/i);
          r = ((!(r !== null && r.length > 2)) ? r[1] : a.img[i]);
          $g.load_cnv(a.cnv[i], r, function (img, id, args, url) {
            $g._on_load_asset(url);
          });
        }
        else if ($g.is_str(a.cnv)) {
          r = a.img.match(/(.+)\.(gif|jpg|jpeg|png)$/i);
          r = ((!(r !== null && r.length > 2)) ? r[1] : a.img);
          $g.load_cnv(a.cnv, r, function (img, id, args, url) {
            $g._on_load_asset(url);
          });
        }
      }
      // a.snd
      if (undefined !== a.snd) {
        if ($g.is_arr(a.snd)) for (var i = 0; i < a.snd.length; i++) {
          r = a.snd[i].match(/(.+)\.(wav|ogg|mp3|mid)$/i);
          r = ((!(r !== null && r.length > 2)) ? r[1] : a.snd[i]);
          $g.load_snd(snddir + a.snd[i], r);
          $g._on_load_asset(a.snd[i]);
        }
        else if ($g.is_str(a.snd)) {
          r = a.snd.match(/(.+)\.(wav|ogg|mp3|mid)$/i);
          r = ((!(r !== null && r.length > 2)) ? r[1] : a.snd);
          $g.load_snd(snddir + a.snd, r);
          $g._on_load_asset(a.snd);
        }
      }
    }
  };

  $g._on_load_asset = function(u) {
    $g._load_i++;
    if( undefined!==$g._load_el && $g.id($g._load_el)) $g.id($g._load_el).innerHTML = __('Loading') + ' ' + u + '...' + Math.floor((100/$g._load_a.length) * $g._load_i, 1) + '%';
  };
  
  // drawing

  $g.draw_img = function (img, vc, x, y, w, h, sx, sy, sw, sh) {
    var i = null;
    //console.log(typeof img, img);
    if ('string' == typeof img) {
      if ('undefined' != typeof $g.imgs[img]) i = $g.imgs[img];
    } else if (null !== img) {
      i = img;
    }
    if (undefined === x) var x = 0;
    if (undefined === y) var y = 0;
    // drawImage( image, sx, sy, sw, sh, dx, dy, dw, dh );
    if ('object' == typeof i && null !== i && 'object' == typeof vc && 'undefined' != typeof vc.drawImage && !isNaN(x) && !isNaN(y)) {
      if (undefined !== w && undefined !== h) {
        if (isNaN(w) || !w) w = i.width;
        if (isNaN(h) || !h) h = i.height;
        if (undefined !== sx && undefined !== sy && !isNaN(sx) && !isNaN(sy)) {
          if (undefined !== sw && undefined !== sh && !isNaN(sw) && !isNaN(sh)) {
            vc.drawImage(i, Math.round(sx), Math.round(sy), Math.round(sw), Math.round(sh), Math.round(x), Math.round(y), Math.round(w), Math.round(h));
          } else {
            vc.drawImage(i, Math.round(sx), Math.round(sy), Math.round(x), Math.round(y), Math.round(w), Math.round(h));
          }
        } else {
          vc.drawImage(i, Math.round(x), Math.round(y), Math.round(w), Math.round(h));
        }
      } else {
        vc.drawImage(i, Math.round(x), Math.round(y));
      }
    }
  };

  $g.draw_cnv = function (cnv, vc, x, y, w, h, sx, sy, sw, sh) {
    var c = null;
    if ('string' == typeof cnv) {
      if ('undefined' != typeof $g.cnvs[cnv]) c = $g.cnvs[cnv];
    } else if (null !== cnv) {
      c = cnv;
    }
    if (undefined === x) var x = 0;
    if (undefined === y) var y = 0;
    // drawImage( image, sx, sy, sw, sh, dx, dy, dw, dh );
    if ('object' == typeof c && null !== c && 'object' == typeof vc && 'undefined' != typeof vc.drawImage && !isNaN(x) && !isNaN(y)) {
      if (undefined !== w && undefined !== h) {
        if (isNaN(w) || !w) w = i.width;
        if (isNaN(h) || !h) h = i.height;
        if (undefined !== sx && undefined !== sy && !isNaN(sx) && !isNaN(sy)) {
          if (undefined !== sw && undefined !== sh && !isNaN(sw) && !isNaN(sh)) {
            vc.drawImage(c, Math.round(sx), Math.round(sy), Math.round(sw), Math.round(sh), Math.round(x), Math.round(y), Math.round(w), Math.round(h));
          } else {
            vc.drawImage(c, Math.round(sx), Math.round(sy), Math.round(w), Math.round(h), Math.round(x), Math.round(y));
          }
        } else {
          vc.drawImage(c, Math.round(x), Math.round(y), Math.round(w), Math.round(h));
        }
      } else {
        vc.drawImage(c, Math.round(x), Math.round(y));
      }
    }
  };

  $g.clear_cnv = function (id) {
    var cnv;
    if (undefined !== $g.cnvs[id]) {
      cnv = $g.cnvs[id];
    } else cnv = $g.id(id);
    if (cnv) {
      cnv.width = cnv.width;
    }
  };

// sound api

  $g.play_snd = function (id) {
    if ($g._is_snds && 'object' == typeof $g.snds && undefined !== typeof $g.snds[id] &&
      'function' == typeof $g.snds[id].play) $g.snds[id].play();
  };
  $g.stop_snd = function (id) {
    if ('object' == typeof $g.snds && 'undefined' != typeof $g.snds[id] &&
      'function' == typeof $g.snds[id].pause) $g.snds[id].pause();
  };

  if ('undefined' == typeof $g.ac) {
    try {
      $g.ac = new AudioContext();
    } catch (e) {
      //$g.err('Web Audio API is not supported in this browser');
      $g.ac = null;
    }
  }

  $g.play_syn = function (freq, time, type) {
    if (!$g.ac) return;
    var o = $g.ac.createOscillator();
    o.frequency.value = freq;
    o.type = ((undefined === type) ? 'square' : type);
    o.connect($g.ac.destination);
    o.start(0);
    setTimeout(function () {
      o.stop(0);
      o.disconnect($g.ac.destination);
    }, time);
  };

  $g._resize = function() {
    if( typeof( window.innerWidth ) == 'number' ) {//Non-IE
      $g.ww = window.innerWidth;
      $g.wh = window.innerHeight;
    } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {//IE 6+ in 'standards compliant mode'
      $g.ww = document.documentElement.clientWidth;
      $g.wh = document.documentElement.clientHeight;
    } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {//IE 4 compatible
      $g.ww = document.body.clientWidth;
      $g.wh = document.body.clientHeight;
    }
  };

  $g._keydown = function(e) {
    var e = (window.event || e)
    $g.kc = (e.keyCode || e.which);
    $g.kALT = (e.altKey || null);
    $g.kCTRL = (e.ctrlKey || null);
    $g.kSHIFT = (e.shiftKey || null);
  };

// pub/sub

  $g._mq = {};

  $g.sub = function (channel, fn) {
    if (!$g._mq[channel]) $g._mq[channel] = [];
    $g._mq[channel].push({context: this, callback: fn});
  };

  $g.unsub = function (channel, fn) {
    if (!$g._mq.hasOwnProperty(channel)) {
      return false;
    }
    for (var i = 0, len = $g._mq[channel].length; i < len; i++) {
      if ($g._mq[channel][i].callback === fn) {
        $g._mq[channel].splice(i, 1);
        return true;
      }
    }
    return false;
  };

  $g.pub = function (channel) {
    if (!$g._mq[channel]) return false;
    var args = Array.prototype.slice.call(arguments, 1), i, l;
    for (i = 0, l = $g._mq[channel].length; i < l; i++) {
      var subscription = $g._mq[channel][i];
      subscription.callback.apply(subscription.context, args);
    }
    return this;
  };

// geo location

  $g.geo_loc = function (fn) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (e) {
        if (e.coords) fn({lat: e.coords.latitude, lng: e.coords.longitude});
      });
    }
  };

// css anim

  $g.ontransend = function (el, fn) {
    el.addEventListener('transitionend', fn, true);
  };

// browsers detection

  //$g['ff'] = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  $g.ff = typeof InstallTrigger !== 'undefined'; // Firefox 1.0+
  $g.op = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0; // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
  $g.sf = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0; // At least Safari 3+: "[object HTMLElementConstructor]"
  $g.cr = !!window.chrome && !$g.op; // Chrome 1+
  //if(undefined === $g['ie'])
  $g.ie = /*@cc_on!@*/false || !!document.documentMode; // At least IE6
  $g.ie10 = /*@cc_on!@*/false && document.documentMode === 10;
  $g.ie11 = $g.ie && navigator.userAgent.indexOf('MSIE') == -1;

//namespaces
  $g.svgNS = 'http://www.w3.org/2000/svg';
  $g.xlinkNS = 'http://www.w3.org/1999/xlink';
  $g.xulNS = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul';

  return $g;

}(window.lib || {}));

// polyfills

if ('undefined'==typeof console) window.console={
  '_alerts':true,
  '_':function(){ if(console._alerts) alert(Array.prototype.slice.call(arguments).join('\n')); },
  'assert':function(){ console._(arguments); },
  'clear':function(){},
  'count':function(){},
  'debug':function(){ console._(arguments); },
  'dir':function(){ console._(arguments); },
  'dirxml':function(){},
  'error':function(){ console._(arguments); },
  'exception':function(){ console._(arguments); },
  'group':function(){},
  'groupCollapsed':function(){},
  'groupEnd':function(){},
  'info':function(){ console._(arguments); },
  'log':function(){ console._(arguments); },
  'profile':function(){},
  'profileEnd':function(){},
  'table':function(){ console._(arguments); },
  'time':function(){},
  'timeEnd':function(){},
  'timeStamp':function(){},
  'trace':function(){ console._(arguments); },
  'warn':function(){ console._(arguments); }
};

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    //return this.replace(/^\s+|\s+$/g,'');
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  }
};

//https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
// Шаги алгоритма ECMA-262, 5-е издание, 15.4.4.18
// Ссылка (en): http://es5.github.io/#x15.4.4.18
// Ссылка (ru): http://es5.javascript.ru/x15.4.html#x15.4.4.18
if (!Array.prototype.forEach) {

  Array.prototype.forEach = function (callback, thisArg) {

    var T, k;

    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Положим O равным результату вызова ToObject passing the |this| value as the argument.
    var O = Object(this);

    // 2. Положим lenValue равным результату вызова внутреннего метода Get объекта O с аргументом "length".
    // 3. Положим len равным ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. Если IsCallable(callback) равен false, выкинем исключение TypeError.
    // Смотрите: http://es5.github.com/#x9.11
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. Если thisArg присутствует, положим T равным thisArg; иначе положим T равным undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Положим k равным 0
    k = 0;

    // 7. Пока k < len, будем повторять
    while (k < len) {

      var kValue;

      // a. Положим Pk равным ToString(k).
      //   Это неявное преобразование для левостороннего операнда в операторе in
      // b. Положим kPresent равным результату вызова внутреннего метода HasProperty объекта O с аргументом Pk.
      //   Этот шаг может быть объединён с шагом c
      // c. Если kPresent равен true, то
      if (k in O) {

        // i. Положим kValue равным результату вызова внутреннего метода Get объекта O с аргументом Pk.
        kValue = O[k];

        // ii. Вызовем внутренний метод Call функции callback с объектом T в качестве значения this и
        // списком аргументов, содержащим kValue, k и O.
        callback.call(T, kValue, k, O);
      }
      // d. Увеличим k на 1.
      k++;
    }
    // 8. Вернём undefined.
  };
}

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(cb, el) { window.setTimeout(function(){cb(+new Date());}, $g.timeout[$g.TIME_ANIM]); };

window.URL = window.URL || window.webkitURL || null;

window.AudioContext =
  window.AudioContext ||
  window.webkitAudioContext ||
  window.mozAudioContext ||
  window.oAudioContext ||
  window.msAudioContext || null;

// localization back compat
if ('undefined'==typeof __) function __(k) { return (undefined!==window.i18n[k]) ? window.i18n[k] : k };

// console sugar
function log() {console.log.apply(console || null, Array.prototype.slice.call(arguments));}
function trace() {console.trace.apply(console || null, Array.prototype.slice.call(arguments));}
