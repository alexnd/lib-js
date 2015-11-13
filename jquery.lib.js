(function( $ ) {

  $.fn.fill_form = function(v) {
    return this.each(function(i, _el) {
      var pel = $(_el);
      if (!pel.length) return;
      for(var k in v) {
        if(!v.hasOwnProperty(k)) continue;
        var el = pel.find("input[name='"+k+"'],textarea[name='"+k+"']");
        log('EL1',el);
        if (el.length) {
          if( el.first().attr('type') === 'checkbox' || el.first().attr('type') === 'radio' ) {
            if ($.isArray(v[k])) {
              el.each(function(j, o){
                if (v[k].indexOf($(o).val()) !== -1 ) {
                  $(o).attr('checked', true);
                } else {
                  $(o).attr('checked', false);
                }
              });
            } else {
              el.each(function(j, o){
                if (v[k] === $(o).val() ) {
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
          log('EL2',el);
          if (el.length) {
            el.find('option').each(function(j, o){
              if ($.isArray(v[k])) {
                if (v[k].indexOf($(o).val()) !== -1 ) {
                  $(o).get(0).selected = true;
                } else {
                  $(o).get(0).selected = false;
                }
              } else {
                if( v[k] === $(o).val() ) {
                  $(o).get(0).selected = true;
                } else {
                  $(o).get(0).selected = false;
                }
              }
            });
          } else {
            el = $('#'+k);
            log('EL3',el);
            if (el.length) {
              if ( el.attr('type') === 'checkbox' || el.attr('type') === 'radio' ) {
                if (v[k].indexOf(el.val()) !== -1 ) {
                  el.attr('checked', true);
                } else {
                  el.attr('checked', false);
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
                    if( v[k] === $(o).val() ) {
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

}( jQuery ));