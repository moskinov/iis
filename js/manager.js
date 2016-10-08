function MainManager_f() {

  this.MIN = 50000;
  this.MAX = 400000;
  this.view = $('[data-example-view]');

  this.init = function () {

    //quote slider init
    $('[data-main-slider],[data-faq-slider]').owlCarousel({
      items: 1,
      nav: true,
      mouseDrag: false,
      autoHeight: true,
      navRewind: false,
      navText: ['','']
    });

    //input check value
    $('[data-value]').keydown(function (e) {
      if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 || (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) || (e.keyCode >= 35 && e.keyCode <= 40)) {
        return;
      }
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
    });

    //init main drug & value investment
    MainManager.initDrug('data-slider-example','data-value-example');
    MainManager.initDrug('data-slider-2','data-value-2');

  };

  this.initDrug = function (drug, input) {

    var inputEl = $('['+input+']'),
        dragEl = $('['+drug+']');

    dragEl.nstSlider({
      "rounding": {
        "1000": "100000",
        "2000": "200000",
        "5000": "300000",
        "10000": "400000"
      },
      "left_grip_selector": ".leftGrip",
      "value_bar_selector": ".bar",
      "user_drag_start_callback": function() {
        inputEl.blur()
      },
      "value_changed_callback": function(cause, leftValue) {

        var focusInput = inputEl.is(":focus");

        if (!focusInput) {

          inputEl.val(leftValue);
          inputEl.removeClass('error');

          if(drug == 'data-slider-example') {
            MainManager.showResultMain(leftValue);
          }

        }
      }
    });

    inputEl.on("change paste keyup keydown", function() {

      var val = this.value;

      if(input == 'data-value-example') {
        MainManager.showResultMain(val);
      }

      if (val < MainManager.MIN || val > MainManager.MAX) {
        $(this).addClass('error');
      } else {
        $(this).removeClass('error');
      }

      dragEl.nstSlider('set_position', val, MainManager.MAX);

    });

  };

  this.showResultMain  = function(num){

    var a = parseInt(num);

    if (a < MainManager.MIN || a > MainManager.MAX || num == '') {

      MainManager.view.addClass('error');

      $('[data-strategy]').hide();

    } else {

      MainManager.view.removeClass('error');

      $('[data-strategy]').show();
    }

    $('[data-strategy]').each(function(){
      var p = parseInt($(this).attr('data-strategy'));
      $(this).html(MainManager.calcMain(a,p))
    });
  };

  this.calcMain = function(val,attr) {
    var p2 = (val*attr) / 100 + val;
    var str = p2.toString();
    var res = str.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
    return res;
  }


}
