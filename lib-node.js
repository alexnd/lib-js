/*
 * Node.js application library
 * Copyright (c) 2014-2016 Alexander Melanchenko
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

    capitalise: function (s) {
      return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
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

    is_empty: function (v) {
      if (v === undefined) return true;
      if (v == null) return true;
      else if (lib.is_arr(v) || lib.is_str(v)) return !v.length;
      else if (lib.is_obj(v)) return !Object.keys(v).length;
      return false;
    },

    is_email: function (v) {
      return !!(this.is_str(v) && v.match(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i));
    },

    is_apikey: function (v) {
      //TODO: match 363d8522-ef01-fb7f-c6c2-63a19e6c16b3 (must be named is_uuid())
      return !!(this.is_str(v) && v.match(/^[a-zA-Z0-9\-]{3,}$/));
    },

    is_username: function (v, len) {
      var len = ('undefined'==typeof len) ? 4 : len, p = new RegExp('^[a-zA-Z0-9_]{'+len+',}$');
      return !!(this.is_str(v) && v.match(p));
    },

    is_phone: function (v) {
      //return (this.is_str(v) && v.match(/^[\s()+-]*([0-9][\s()+-]*){6,20}$/));
	  //TODO: temporary better one
	  return !!(this.is_str(v) && v.match(/^\+\d{1,}[0-9 \-]{8,26}$/));
    },

    is_password: function (v) {
      return !!((this.is_str(v) && v.length) ? true : false);
    },

    is_url: function (v) {
      return !!(this.is_str(v) && v.match(/^https?\:\/\/\w+/));
    },

    is_lat: function (v) {
      return (v !== null && ('' + v).match(/^(\+|-)?(?:90(?:(?:\.0{1,15})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,15})?))$/)) ? true : false;
    },

    is_lng: function (v) {
      return (v !== null && ('' + v).match(/^(\+|-)?(?:180(?:(?:\.0{1,15})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,15})?))$/)) ? true : false;
    },
	
    to_int: function (s) {
      var n = parseInt(s, 10);
      return n === null || isNaN(n) ? 0 : n;
    },

    to_float: function (v) {
      var n = parseFloat(v);
      return n === null || isNaN(n) ? 0 : n;
    },

    to_numstr: function (v) {
      if (v === null) return '0';
      else if (v === '') return '0';
      else return ''+v;
    },

    arr_intersect: function (a, a2) {
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
    },

    in_arr: function (a) {
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
    },

    arr_trim: function (a) {
      try {
        for (var i = a.length; i--;) {
          if (a[i] === undefined) a.splice(i, 1);
        }
      } catch (e) {}
    },

    // Convert numeric degrees to radians
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

    // Return a random integer between min and max
    // Using Math.round() will give you a non-uniform distribution!
    rnd_i: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Return a random number between min and max
    rnd_a: function (min, max) {
      return Math.random() * (max - min) + min;
    },

    rnd_date: function (y, m, d) {
      var start = new Date(y, m - 1, d),
        end = new Date();
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    },

    rnd_circ: function () {
      var t = 2 * Math.PI * Math.random();
      var u = Math.random() + Math.random();
      var r = (u>1) ? 2-u : u;
      return [r * Math.cos(t), r * Math.sin(t)];
    },

    // Return a universally unique identifier in form 550e8400-e29b-41d4-a716-446655440000
    uuid: function () {
      var s = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      };
      return (s() + s() + '-' + s() + '-' + s() + '-' + s() + '-' + s() + s() + s());
    },

    // Return a unique identifier with the given length
    uid: function (len) {
      var buf = [], chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', charlen = chars.length,
	  len = ('undefined'==typeof len) ? 32 : len;
      for (var i = 0; i < len; ++i) {
        buf.push(chars[this.rnd_i(0, charlen - 1)]);
      }
      return buf.join('');
    },

    // make url-encoded representation of object to use as http requests data
    serialize: function(obj, prefix) {
      var str = [];
      for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
          var k = prefix ? prefix + '[' + p + ']' : p,
            v = obj[p];
          str.push(typeof v == 'object' ? this.serialize(v, k) : encodeURIComponent(k) + '=' + encodeURIComponent(v));
        }
      }
      return str.join('&');
    },
	
    unserialize: function (s) {
      return s.split('&').reduce(function (a, p) {
        var ps = p.split('=').map(function (v) {
          return decodeURIComponent(v.replace('+', ' '));
        });
        a[ps[0]] = ps[1];
        return a;
      }, {});
    },

    // Return a distance between 2 points
    dist: function (x1, y1, x2, y2) {
      if (!isNaN(x1) || !isNaN(x2) || !isNaN(y1) || !isNaN(y2)) return 0;
      return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    },

    rEarth: 6372795, // Radius of the earth in m
    dist_latlng: function (lat1, lng1, lat2, lng2) {
      var dLat = $g.to_rad(lat2 - lat1);
      var dLng = $g.to_rad(lng2 - lng1);
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos($g.to_rad(lat1)) * Math.cos($g.to_rad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = $g.rEarth * c;
      return d;
    },

    /* return bounding rectangle of path
     input: [[lat,lng],...] or [{lat,lng},...]
     output:
                north (0)
     west (1) *********{x2,y2} east (3)
              {x1,y1}********
                south (2)
    */
    path_bounds : function (path) {
      var r = [];
      for (var i=0; i<path.length; i++) {
        if (i===0) {
          if (this.is_arr(path[i])) {
            r.push(path[i][0]); //0: y2 (north)
            r.push(path[i][1]); //1: x1 (west)
            r.push(path[i][0]); //2: y1 (south)
            r.push(path[i][1]); //3: x2 (east)
          } else {
            r = { north: path[i].lat, west: path[i].lng, south: path[i].lat, east: path[i].lng };
          }
        } else {
          if (this.is_arr(r)) {
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
    },

    point_in_poly : function (v, p, is_str, is_verts_arr, p_latlng) {
      if (undefined !== is_str && is_str) v = this.json_decode(v);
      if (undefined !== p_latlng && p_latlng && this.is_obj(p)) {
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
        r = cn & 1;    // 0 if even (out), and 1 if  odd (in)
      }
      return r;
    },
	
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
    uniqid: function (prefix, more_entropy) {
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

    // Return y position of point on line x1;y1, x2;y2 (x between x1 and x2)
    allign_terrain_y: function (x1, y1, x2, y2, x) {
      if (y1 == y2 || x1 == x2) {
        var y = y1;
      } else {
        var y = y1 + ( (y2 - y1) / (x2 - x1) ) * (x - x1);
      }
      return y;
    },

    // Return terrain unit position pased on real X or Y
    terrain_unit_coord: function (x) {
      if (!isNaN(x) && x > 0) return Math.ceil(x / 20);
      return 0;
    },

    // Return real position base on terrain unit X or Y
    terrain_real_coord: function (x) {
      if (!isNaN(x)) return x * 20;
      return 0;
    },

    // Return current timestamp (milliseconds since 01-01-1970)
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
      var p = s.match(/^(\d+)\.(\d+)\.(\d+)/), d = new Date();
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
    },

    ts_to_sqldate : function(_v) {
      var v = _v || Date.now();
      var d = new Date(v);
      var m = d.getMonth() - 1;
      return d.getFullYear() + '-' + 
      ((d.getMonth() + 1 < 10) ? ('0' + (d.getMonth() + 1)) : (d.getMonth() + 1)) + '-' +
      ((d.getDate() < 10) ? ('0' + d.getDate()) : d.getDate()) + ' ' +
      ((d.getHours() < 10) ? ('0' + d.getHours()) : d.getHours()) + ':' +
      ((d.getMinutes() < 10) ? ('0' + d.getMinutes()) : d.getMinutes()) + ':' + 
      ((d.getSeconds() < 10) ? ('0' + d.getSeconds()) : d.getSeconds());
    },

    leapYear : function(y) {
      return ((y % 4 == 0) && (y % 100 != 0)) || (y % 400 == 0);
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
        '<body>' +
        body +
        '</body>' +
        '</html>';
      return doc;
    },

    fix_aws_post_json : function(req, res, next) {
      if (req.headers['x-amz-sns-message-type']) {
        req.headers['content-type'] = 'application/json;charset=UTF-8';
      }
      next();
    }
  };
  return lib;
};
