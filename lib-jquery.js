/*
 * Collection of some useful helper functions used under jQuery lib
 * Copyright (c) 2012-2016 Alexander Melanchenko
 * http://alexnd.com
 * Released under the MIT License
 */

(function( $ ) {

  /*
   Fills selected element with hash of values, e.g:
     $('#myForm').fill_form( {'username':'Gordon', '_csrf':'!123!'} );
  */
  $.fn.fill_form = function(v) {
    return this.each(function(i, _el) {
      var pel = $(_el);
      if (!pel.length) return;
      for(var k in v) {
        if(!v.hasOwnProperty(k)) continue;
        var el = pel.find("input[name='"+k+"'],textarea[name='"+k+"']");
        if (el.length) {
          if( el.first().attr('type') === 'checkbox' || el.first().attr('type') === 'radio' ) {
            if ($.isArray(v[k])) {
              el.each(function(j, o){
                if (v[k].indexOf($(o).val()) !== -1 ) {
                  $(o).get(0).checked = true;
                } else {
                  $(o).get(0).checked = false;
                }
              });
            } else {
              el.each(function(j, o){
                //if (v[k] === $(o).val() ) {
                $(o).val(v[k]);
                if (v[k]) {
                  $(o).get(0).checked = true;
                } else {
                  $(o).get(0).checked = false;
                }
              });
            }
          } else {
            el.val(v[k]);
          }
        } else {
          el = pel.find("select[name='"+k+"']");
          if (el.length) {
            el.find('option').each(function(j, o){
              if ($.isArray(v[k])) {
                if (v[k].indexOf($(o).val()) !== -1 ) {
                  $(o).get(0).selected = true;
                } else {
                  $(o).get(0).selected = false;
                }
              } else {
                if( v[k] == $(o).val() ) {
                  $(o).get(0).selected = true;
                } else {
                  $(o).get(0).selected = false;
                }
              }
            });
          } else {
            el = $('#'+k);
            if (el.length) {
              if ( el.attr('type') === 'checkbox' || el.attr('type') === 'radio' ) {
                if (v[k].indexOf(el.val()) !== -1 ) {
                  el.get(0).checked = true;
                } else {
                  el.get(0).checked = false;
                }
              } else if ( el.prop('nodeName') === 'SELECT') {
                el.find('option').each(function(j, o){
                  if ($.isArray(v[k])) {
                    if (v[k].indexOf($(o).val()) !== -1 ) {
                      $(o).get(0).selected = true;
                    } else {
                      $(o).get(0).selected = false;
                    }
                  } else {
                    if( v[k] == $(o).val() ) {
                      $(o).get(0).selected = true;
                    } else {
                      $(o).get(0).selected = false;
                    }
                  }
                });
              } else {
                //if ( el.attr('type') === 'input' || el.prop('nodeName') === 'TEXTAREA' ) {
                el.val(v[k]);
              }
            }
          }
        }
      }
    });
  };



  $.fn.onchangeval = function() {
    return this.each (function(i, el) {
      $(el).change(function () {
        $(this).val(($(this).get(0).checked) ? 1 : 0);
      });
    });
  };

  $.fn.urlify = function(o) {
    var o = (typeof o == 'object' && o !== null) ? o : {};
    return this.each (function(i, el) {
      var s = $(el).html();
      if (s) {
        s = s.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,
            '<a href="$1"' + ((o.blank) ? ' target="blank"' : '') + '>$1</a>')
        $(el).html(s);
      }
    });
  };

  $.fn.getForm = function(el) {
    var r = {};
    el.find('input[name],select[name]').each(function (i, e) {
      if (e.type === 'radio') {
        if (e.checked) {
          r[e.name] = e.value;
        }
      } else if (e.type === 'checkbox') {
        if (!r[e.name]) {
          r[e.name] = [];
        }
        if (e.checked) {
          r[e.name].push(e.value);
        }
      } else {
        r[e.name] = e.value;
      }
    });
    return r;
  }

}( jQuery ));
