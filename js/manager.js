function MainManager_f() {

  this.MIN = 50000;
  this.MIDDLE = 200000;
  this.MAX = 400000;
  this.view = $('[data-example-view]');
  this.validate = $('[data-validate]');
  this.applicationStep = $('[data-slide-application]');

  this.phone = $('[data-phone]');
  this.cirilica = $('[data-cirilica]');
  this.mail = $('[data-mail]');
  this.numeral = $('[data-numeral]');
  this.series = $('[data-series]');
  this.code = $('[data-code]');
  this.all = $('[data-all]');

  this.regexpCirilica = /^[ёЁа-яА-Яa-zA-Z\s\-]+$/;
  this.regexpMail = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/;
  this.regexpAll = /[^\>]*/;

  this.init = function () {

    //static append day select
    for(var i=2; i < 32; i++) {
      if(i < 10) {
        $('[data-day]').append('<option value="0'+i+'">0'+i+'</option>')
      } else {
        $('[data-day]').append('<option value="'+i+'">'+i+'</option>')
      }
    }

    //static append month select
    for(var i=2; i < 13; i++) {
      if(i < 10) {
        $('[data-month]').append('<option value="0'+i+'">0'+i+'</option>')
      } else {
        $('[data-month]').append('<option value="'+i+'">'+i+'</option>')
      }
    }

    //static append year select
    for(var i=2; i < 17; i++) {
      if(i < 10) {
        $('[data-year]').append('<option value="0'+i+'">200'+i+'</option>')
      } else {
        $('[data-year]').append('<option value="'+i+'">20'+i+'</option>')
      }
    }

    //quote slider init
    $('[data-main-slider],[data-faq-slider]').owlCarousel({
      items: 1,
      nav: true,
      mouseDrag: false,
      autoHeight: true,
      navRewind: false,
      navText: ['','']
    });

    ////init steps application form
    //MainManager.applicationStep.owlCarousel({
    //  items: 1,
    //  nav: false,
    //  mouseDrag: false,
    //  autoHeight: true,
    //  navRewind: false,
    //  navText: ['','']
    //});



    //input check value
    MainManager.numeral.keydown(function (e) {
      if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 || (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) || (e.keyCode >= 35 && e.keyCode <= 40)) {
        return;
      }
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
    });

    //init main drug & value investment
    MainManager.initDrug('data-slider-example','data-value-example');

    //init application drug & value investment
    MainManager.initDrug('data-slider-application','data-value-application');

    //init phone value
    MainManager.phone.mask("+7 (999) 999-99-99");
    MainManager.phone.on('focusout',function(){
      var el = $(this);
      setTimeout(function(){
        MainManager.validInit(el,MainManager.regexpAll,'Поле не должно быть пустым')
      },200);
    });

    //init cirilica value
    MainManager.series.mask('99 99 999 999');
    MainManager.series.on('focusout',function(){
      var el = $(this);
      setTimeout(function(){
        MainManager.validInit(el,MainManager.regexpAll,'Поле не должно быть пустым')
      },200);
    });

    //init code value
    MainManager.code.mask('999-999');
    MainManager.code.on('focusout',function(){
      var el = $(this);
      setTimeout(function(){
        MainManager.validInit(el,MainManager.regexpAll,'Поле не должно быть пустым')
      },200);
    });

    //init cirilica value
    MainManager.cirilica.on('focusout',function(){
      MainManager.validInit($(this),MainManager.regexpCirilica,'Только буквы, пробел и дефис');
    });

    //init mail value
    MainManager.mail.on('focusout',function(){
      MainManager.validInit($(this),MainManager.regexpMail,'E-mail введен некорректно');
    });

    //init all value
    MainManager.all.on('focusout',function(){
      MainManager.validInit($(this),MainManager.regexpAll,'Поле не должно быть пустым');
    });

    //clear error on focus
    MainManager.validate.focus(function(){
      MainManager.validClear($(this))
    });

  };

  this.initDrug = function (drug, input) {

    var inputEl = $('['+input+']'),
        dragEl = $('['+drug+']'),
        getVal = sessionStorage.getItem('value');

    //if(getVal || getVal > MainManager.MIN && getVal < MainManager.MAX) {
    //  dragEl.attr('data-cur_min',getVal);
    //} else {
    //  dragEl.attr('data-cur_min',200000);
    //}

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

          //sessionStorage.value = leftValue;

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
        //sessionStorage.value = '';
      } else {
        $(this).removeClass('error');
        //sessionStorage.value = val;
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

  this.validInit = function (input,valid,text) {


    MainManager.validClear(input);

    //if((input.is('[data-user-middle-name]') && input.val() == '') || (input.is('[data-user-phone]') && input.val() == '')) {

    //  return true;

    //} else {

      if (valid.test(input.val()) && input.val() != '') {

        MainManager.validClear(input);

        return true;

      } else {

        if(input.val() == '') {

          MainManager.validError(input,'Поле не должно быть пустым');

        } else {

          MainManager.validError(input,text);

        }

        return false;
      }
    //}
  };

  this.validClear = function (input) {

    input.removeClass('field-has-error');

    if(input.nextAll().hasClass('textOfError')) {
      input.nextAll().remove();
    }
  };

  this.validError = function (input,text) {

    input.addClass('field-has-error').after('<div class="textOfError color"><span>'+text+'</span></div>');

  };

  this.submitCall = function () {

    var validate = [
      {
        name: 'data-name',
        regexp: MainManager.regexpCirilica,
        text: 'Только буквы, пробел и дефис'
      },
      {
        name: 'data-surname',
        regexp: MainManager.regexpCirilica,
        text: 'Только буквы, пробел и дефис'
      },
      {
        name: 'data-phone-contact',
        regexp: MainManager.regexpAll,
        text: 'Поле не должно быть пустым'
      }
    ];

    var valid;

    for (var i in validate) {

      valid = MainManager.validInit($('['+validate[i].name+']'),validate[i].regexp,validate[i].text);

      if (!valid) {

        break;
      }

    }

    if (valid) {
      alert("Submit!");
      return true;
    } else {
      return false;
    }

  };

  this.nextStep = function (form, page){

    if(page == 1) {
      var validate = [
        {
          name: 'data-application-surname',
          regexp: MainManager.regexpCirilica,
          text: 'Только буквы, пробел и дефис'
        },
        {
          name: 'data-application-name',
          regexp: MainManager.regexpCirilica,
          text: 'Только буквы, пробел и дефис'
        },
        {
          name: 'data-application-middlename',
          regexp: MainManager.regexpCirilica,
          text: 'Только буквы, пробел и дефис'
        },
        {
          name: 'data-application-mail',
          regexp: MainManager.regexpMail,
          text: 'E-mail введен некорректно'
        },
        {
          name: 'data-application-phone',
          regexp: MainManager.regexpAll,
          text: 'Поле не должно быть пустым'
        },
        {
          name: 'data-series',
          regexp: MainManager.regexpAll,
          text: 'Поле не должно быть пустым'
        },
        {
          name: 'data-issued',
          regexp: MainManager.regexpAll,
          text: 'Поле не должно быть пустым'
        },
        {
          name: 'data-code',
          regexp: MainManager.regexpAll,
          text: 'Поле не должно быть пустым'
        }
      ];

      var valid;
      var validDrag = !$('[data-value-application]').hasClass('error');
      var choice = $('[data-choice]').is(':checked');

      for (var i in validate) {

        valid = MainManager.validInit($('['+validate[i].name+']'),validate[i].regexp,validate[i].text);

        if (!valid) {
          //$("[data-modal]").animate({"scrollTop":300},"slow");
          break;
        }

      }

      if (valid && validDrag && choice) {

        $('[data-step-form='+form+']').trigger('next.owl.carousel');

      } else {



      }

    }


  };

  this.showModal = function (modal) {
    $('body').addClass('open');
    $('[data-modal='+modal+']').addClass('open');
    var drag = $('[data-slider-'+modal+']');

    if(modal == 'application') {
      $('[data-step-form='+modal+']').owlCarousel({
        items: 1,
        nav: false,
        mouseDrag: false,
        autoHeight: true,
        navRewind: false,
        smartSpeed: 100,
        navText: ['','']
      });


      drag.nstSlider('refresh');
      drag.nstSlider('set_position', MainManager.MIDDLE, MainManager.MAX);

    }

  };

  this.hideModal = function (modal) {
    $('body').removeClass('open');
    $('[data-modal='+modal+']').removeClass('open');
    MainManager.clearForm(modal);
  };

  this.clearForm = function (form) {

    $('[data-step-form='+form+']').trigger('destroy.owl.carousel');
    var form = $('#'+form+'');

    form.find('[data-validate]').each(function(){
      MainManager.validClear($(this))
    });

    form.trigger("reset");

  };

  this.choiceApplication = function (choice) {

    if(choice == 'yes') {
      $('[data-choice-block]').removeClass('no');
      $('[data-step-form="application"]').trigger('refresh.owl.carousel');
    } else {
      $('[data-choice-block]').addClass('no');
      $('[data-step-form="application"]').trigger('refresh.owl.carousel');
    }

    //check.is(':checked')

  }
}
