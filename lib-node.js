/*
 * Node.js application library
 * Copyright (c) 2014-2015 Alexander Melanchenko
 * http://alexnd.com
 * Released under the MIT License
 */

if ('object' == typeof module && null !== module) module.exports = function (app) {
  var lib = {

    months: ['Янв', 'Фев', 'Мар', 'Апр', 'Мая', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ной', 'Дек'],

    inject: function (dest, src) {
      if ('object' == typeof dest && 'object' == typeof src) for (var p in src) {
        if (!src.hasOwnProperty(p)) continue;
        dest[p] = src[p];
      }
    },

    clone: function (src) {
      var dest = {};
      for (var p in src) {
        if (!src.hasOwnProperty(p)) continue;
        dest[p] = src[p];
      }
      return dest;
    },

    copy: function (dest, src) {
      dest = lib.clone(src);
    },

    to_str: Object.prototype.toString,

    is_str: function (s) {
      return typeof s === 'string';
    },

    trim_str: function (s) {
      return s.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
    },

    is_arr: function (a) {
      return lib.to_str.call(a) === '[object Array]';
    },

    is_obj: function (v) {
      return v !== null && typeof v === 'object';
    },

    is_num: function (v) {
      return typeof v === 'number';
    },

    is_fun: function (v) {
      return typeof v === 'function';
    },

    is_null: function (v) {
      return v === null;
    },

    to_int: function (s) {
      var n = parseInt(s, 10);
      return n == null || isNaN(n) ? 0 : n;
    },

    arr_intersect: function (a, a2) {
      try {
        for (var i = a.length; i--;) {
          for (var j = a2.length; j--;) {
            if (a[i] == a2[j]) return true;
          }
        }
        ;
        return false;
      } catch (e) {
        return null
      }
      ;
    },

    in_arr: function (a) {
      try {
        for (var i = a.length; i--;) {
          for (var j = 0; j < arguments.length; j++) {
            if (j == 0) continue;
            if (a[i] == arguments[j]) return i;
          }
        }
        ;
        return null;
      } catch (e) {
        return null
      }
      ;
    },

    arr_trim: function (a) {
      try {
        for (var i = a.length; i--;) {
          if (a[i] === undefined) a.splice(i, 1);
        }
        ;
      } catch (e) {
      }
      ;
    },

    // converts numeric degrees to radians
    to_rad: function (a) {
      if (!isNaN(a)) {
        return parseFloat(a) * Math.PI / 180;
      }
      return 0;
    },

    // Return real var type string representation
    to_type: function (obj) {
      return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    },

    to_bool: function (v) {
      return ( (v) ? true : false );
    },

    to_fixed: function (value, precision) {
      var power = Math.pow(10, precision || 0);
      return String(Math.round(value * power) / power);
    },

    // Returns a random integer between min and max
    // Using Math.round() will give you a non-uniform distribution!
    rnd_i: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Returns a random number between min and max
    rnd_a: function (min, max) {
      return Math.random() * (max - min) + min;
    },

    rnd_date: function (y, m, d) {
      var start = new Date(y, m - 1, d),
        end = new Date();
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    },

    uid: function () {
      var s = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      };
      return (s() + s() + '-' + s() + '-' + s() + '-' + s() + '-' + s() + s() + s());
    },

    // calculate distance between 2 points
    dist: function (x1, y1, x2, y2) {
      if (!isNaN(x1) || !isNaN(x2) || !isNaN(y1) || !isNaN(y2)) return 0;
      return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    },

    uniqid: function (prefix, more_entropy) {
      //  discuss at: http://phpjs.org/functions/uniqid/
      // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      //  revised by: Kankrelune (http://www.webfaktory.info/)
      //        note: Uses an internal counter (in php_js global) to avoid collision
      //        test: skip
      //   example 1: uniqid();
      //   returns 1: 'a30285b160c14'
      //   example 2: uniqid('foo');
      //   returns 2: 'fooa30285b1cd361'
      //   example 3: uniqid('bar', true);
      //   returns 3: 'bara20285b23dfd1.31879087'

      if (typeof prefix === 'undefined') {
        prefix = '';
      }

      var retId;
      var formatSeed = function (seed, reqWidth) {
        seed = parseInt(seed, 10)
          .toString(16); // to hex str
        if (reqWidth < seed.length) { // so long we split
          return seed.slice(seed.length - reqWidth);
        }
        if (reqWidth > seed.length) { // so short we pad
          return Array(1 + (reqWidth - seed.length))
              .join('0') + seed;
        }
        return seed;
      };

      // BEGIN REDUNDANT
      if (!lib.php_js) {
        lib.php_js = {};
      }
      // END REDUNDANT
      if (!lib.php_js.uniqidSeed) { // init seed with big random int
        lib.php_js.uniqidSeed = Math.floor(Math.random() * 0x75bcd15);
      }
      lib.php_js.uniqidSeed++;

      retId = prefix; // start with prefix, add current milliseconds hex string
      retId += formatSeed(parseInt(new Date()
          .getTime() / 1000, 10), 8);
      retId += formatSeed(lib.php_js.uniqidSeed, 5); // add seed hex string
      if (more_entropy) {
        // for more entropy we add a float lower to 10
        retId += (Math.random() * 10)
          .toFixed(8)
          .toString();
      }

      return retId;
    },

    // return y position of point on line x1;y1, x2;y2 (x between x1 and x2)
    allign_terrain_y: function (x1, y1, x2, y2, x) {
      if (y1 == y2 || x1 == x2) {
        var y = y1;
      } else {
        var y = y1 + ( (y2 - y1) / (x2 - x1) ) * (x - x1);
      }
      return y;
    },

    // return terrain unit position pased on real X or Y
    terrain_unit_coord: function (x) {
      if (!isNaN(x) && x > 0) return Math.ceil(x / 20);
      return 0;
    },

    // return real position base on terrain unit X or Y
    terrain_real_coord: function (x) {
      if (!isNaN(x)) return x * 20;
      return 0;
    },

    //return current timestamp
    ts: function () {
      return Date.now();
    },

    dtformat0: function (t) {
      if (undefined === t) var t = Date.now();
      var d = new Date(t), s = ((d.getDate() < 10) ? ('0' + d.getDate()) : d.getDate()) + '.' + (d.getMonth() + 1) + '.' + d.getFullYear() + '/' +
        ((d.getHours() < 10) ? ('0' + d.getHours()) : d.getHours()) + ':' + ((d.getMinutes() < 10) ? ('0' + d.getMinutes()) : d.getMinutes())
        + ':' + ((d.getSeconds() < 10) ? ('0' + d.getSeconds()) : d.getSeconds());
      return s;
    },

    //TODO: implement format (example 'Y-M-D h:i' - each symbol interprets as one of values or separator)
    dtformat: function (t, hmonth, format) {
      if (undefined === t) var t = Date.now();
      if (undefined === hmonth) var hmonth = false;
      var d = new Date(t), s = ((d.getDate() < 10) ? ('0' + d.getDate()) : d.getDate()) + '.' +
        ((hmonth) ?
          lib.months[d.getMonth()] :
          ((d.getMonth() + 1 < 10) ? ('0' + (d.getMonth() + 1)) : (d.getMonth() + 1))) + '.' +
        d.getFullYear() + '/' +
        ((d.getHours() < 10) ? ('0' + d.getHours()) : d.getHours()) + ':' +
        ((d.getMinutes() < 10) ? ('0' + d.getMinutes()) : d.getMinutes()) + ':' +
        ((d.getSeconds() < 10) ? ('0' + d.getSeconds()) : d.getSeconds());
      return s;
    },

    // convert date string 'DD.MM.YYYY' to unix timestamp (seconds since 1970)
    dt_to_ts: function (s) {
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
    },

    // convert date string 'YYYY-MM-DD hh:mm:ss' to unix timestamp (seconds since 1970)
    sqldate_to_ts: function (s) {
      var p = s.match(/^(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)$/), d = new Date();
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
    },

    parseCookies: function (request) {
      var list = {},
        rc = request.headers.cookie;

      rc && rc.split(';').forEach(function (cookie) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = unescape(parts.join('='));
      });

      return list;
    },

    json_decode: function (v) {
      if ('string' == typeof v && (v.indexOf('{') == 0 || v.indexOf('[') == 0)) return JSON.parse(v);
      else return {};
    },

    get_path_ext: function (v) {
      p = v.match(/\.([^\.]+)$/);
      if (p) return p[1];
      return '';
    },

    get_path_dir: function (v, s) {
      if (undefined === s) var s = '/';
      return v.substring(0, v.lastIndexOf(s));
    },

    get_path_filename: function (v, s) {
      if (undefined === s) var s = '/';
      return v.substring(v.lastIndexOf(s) + 1);
    },

    get_basename: function (v) {
      return v.substring(0, v.lastIndexOf('.'));
    },

    html_doc: function (body, head) {
      if (undefined === body) var body = '';
      if (undefined === head) var head = '';
      var doc = '<!DOCTYPE html>' +
        '<html>' +
        '<head>' +
        '<meta charset="utf-8"/>' +
        head +
        '</head>' +
        '<body style="margin-left: 25px">' +
        body +
        '</body>' +
        '</html>';
      return doc;
    },

  };
  return lib;
};