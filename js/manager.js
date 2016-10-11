function MainManager_f() {

  this.MIN = 50000;
  this.MIDDLE = 200000;
  this.MAX = 400000;
  this.view = $('[data-example-view]');
  this.validate = $('[data-validate]');
  this.phone = $('[data-phone]');
  this.cirilica = $('[data-cirilica]');
  this.mail = $('[data-mail]');
  this.numeral = $('[data-numeral]');
  this.series = $('[data-series]');
  this.code = $('[data-code]');
  this.all = $('[data-all]');
  this.addressFirst = $('[data-address-first]');
  this.addressLast = $('[data-address-last]');
  this.addressCheck = $('[data-check-address]');
  this.confirmInfo = $('[data-confirm-info]');
  this.actAgreement = $('[data-act-agreement]');
  this.smsBlock = $('[data-sms-block]');
  this.smsBtn = $('[data-btn-sms]');
  this.smsInput = $('[data-sms]');


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

    //input numeral value
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

    //init purchase drug & value investment
    MainManager.initDrug('data-slider-purchase','data-value-purchase');

    //init phone value
    MainManager.phone.mask("+7 (999) 999-99-99");
    MainManager.phone.on('focusout',function(){
      var el = $(this);
      setTimeout(function(){
        MainManager.validInit(el,MainManager.regexpAll,'Поле не должно быть пустым')
      },200);
    });

    //init passport value
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

    //init value address first
    MainManager.addressFirst.on("change paste keyup keydown", function(){

      var val = this.value.length;

      if(val != 0) {

        MainManager.addressCheck.attr('disabled', false);

        if(MainManager.addressCheck.is(':checked')) {

          MainManager.addressLast.val(this.value);

        } else if(MainManager.addressLast.val().length ==0) {

          MainManager.addressLast.val('');
        }

      } else {

        if(MainManager.addressCheck.is(':checked')) {

          MainManager.addressLast.val('');
        }

        MainManager.addressCheck.attr('disabled', true);
        MainManager.addressCheck.attr('checked', false);
        MainManager.addressLast.attr('readonly', false);
      }
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
  };

  this.validInit = function (input,valid,text) {

    MainManager.validClear(input);

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
          name: 'data-'+form+'-surname',
          regexp: MainManager.regexpCirilica,
          text: 'Только буквы, пробел и дефис'
        },
        {
          name: 'data-'+form+'-name',
          regexp: MainManager.regexpCirilica,
          text: 'Только буквы, пробел и дефис'
        },
        {
          name: 'data-'+form+'-middlename',
          regexp: MainManager.regexpCirilica,
          text: 'Только буквы, пробел и дефис'
        },
        {
          name: 'data-'+form+'-mail',
          regexp: MainManager.regexpMail,
          text: 'E-mail введен некорректно'
        },
        {
          name: 'data-'+form+'-phone',
          regexp: MainManager.regexpAll,
          text: 'Поле не должно быть пустым'
        },
        {
          name: 'data-'+form+'-series',
          regexp: MainManager.regexpAll,
          text: 'Поле не должно быть пустым'
        },
        {
          name: 'data-'+form+'-issued',
          regexp: MainManager.regexpAll,
          text: 'Поле не должно быть пустым'
        },
        {
          name: 'data-'+form+'-code',
          regexp: MainManager.regexpAll,
          text: 'Поле не должно быть пустым'
        }
      ];

      var valid;
      var validDrag = !$('[data-amount='+form+']').hasClass('error');
      var choice = $('[data-choice-'+form+']').is(':checked');
      var choiceYes = $('[data-choice-'+form+'="yes"]').is(':checked');
      var choiceValue = $('[data-participant='+form+']').val().length;


      if(validDrag) {

        if(choice && !choiceYes || choiceYes && choiceValue) {

          for (var i in validate) {

            valid = MainManager.validInit($('['+validate[i].name+']'),validate[i].regexp,validate[i].text);

            if (!valid) {

              MainManager.scrollFieldError($('['+validate[i].name+']'));

              break;
            }
          }
        }

        if(!choice) {

          $('[data-choice-'+form+']').addClass('field-has-error');

          MainManager.scrollFieldError($('[data-choice-'+form+']'));
        }

        if(choiceYes && !choiceValue) {

          MainManager.validError($('[data-participant='+form+']'),'Поле не должно быть пустым');

          MainManager.scrollFieldError($('[data-participant='+form+']'));
        }

      } else {

        MainManager.scrollFieldError($('[data-amount='+form+']'));
      }

      if (valid && validDrag && choice) {

        if(choiceYes) {

          if(choiceValue) {

            MainManager.slideNextView(form);
          }

        } else {

          MainManager.slideNextView(form);
        }

      } else {

        return false;
      }
    }

    if(form == 'purchase') {

      if(page == 2) {

        var confirm = MainManager.confirmInfo.is(':checked');

        var validate2 = [
          {
            name: 'data-address-first',
            regexp: MainManager.regexpAll,
            text: 'Поле не должно быть пустым'
          },
          {
            name: 'data-address-last',
            regexp: MainManager.regexpAll,
            text: 'Поле не должно быть пустым'
          }
        ];

        var valid2;

        for (var i2 in validate2) {

          valid2 = MainManager.validInit($('['+validate2[i2].name+']'),validate2[i2].regexp,validate2[i2].text);

          if (!valid2) {

            MainManager.scrollFieldError($('['+validate2[i2].name+']'));

            break;
          }
        }

        if(valid2 && !confirm) {

          MainManager.confirmInfo.addClass('field-has-error');

          MainManager.scrollFieldError(MainManager.confirmInfo);
        }

        if(valid2 && confirm) {

          MainManager.slideNextView(form);
        }

      }
    }

  };

  this.slideNextView = function(el){

    $('[data-step-form='+el+']').trigger('next.owl.carousel');

    $('[data-modal='+el+']').animate({scrollTop: 0}, 500);
  };

  this.submitApplication = function() {
    var validate = [
      {
        name: 'data-application-country',
        regexp: MainManager.regexpCirilica,
        text: 'Только буквы, пробел и дефис'
      },
      {
        name: 'data-application-city',
        regexp: MainManager.regexpAll,
        text: 'Поле не должно быть пустым'
      },
      {
        name: 'data-application-index',
        regexp: MainManager.regexpAll,
        text: 'Поле не должно быть пустым'
      },
      {
        name: 'data-application-street',
        regexp: MainManager.regexpAll,
        text: 'Поле не должно быть пустым'
      },
      {
        name: 'data-application-house',
        regexp: MainManager.regexpAll,
        text: 'Поле не должно быть пустым'
      },
      {
        name: 'data-application-apartment',
        regexp: MainManager.regexpAll,
        text: 'Поле не должно быть пустым'
      }
    ];

    var valid;

    for (var i in validate) {

      valid = MainManager.validInit($('['+validate[i].name+']'),validate[i].regexp,validate[i].text);

      if (!valid) {

        MainManager.scrollFieldError($('['+validate[i].name+']'));

        break;
      }
    }

    if (valid) {

      var data = MainManager.dataJSON($('#application'));

      alert('Submit application form (data in console)');

      console.log(data);

      MainManager.hideModal('application', true);

      MainManager.showModal('documentation',false);

    } else {

      return false;
    }
  };

  this.submitMailDocs = function(){

    var valid;

    valid = MainManager.validInit($('[data-forward-doc-mail]'),MainManager.regexpMail,'E-mail введен некорректно');

    if (valid) {

      alert('Submit documentation mail');

      MainManager.hideModal('forward-doc',true);

    } else {

      return false;
    }
  };

  this.dataJSON = function (form) {

    var o = {};

    var a = form.serializeArray();

    $.each(a, function () {

      if (o[this.name]) {

        if (!o[this.name].push) {

          o[this.name] = [o[this.name]];

        }

        o[this.name].push(this.value || '');

      } else {

        o[this.name] = this.value || '';

      }
    });

    return o;
  };

  this.scrollFieldError = function(field) {

    $('[data-modal]').animate({

      scrollTop: field.offset().top + 350}, 500);
  };

  this.showModal = function (modal, step) {

    $('body').addClass('open');

    $('[data-modal='+modal+']').addClass('open');

    if(step) {

      if(modal == 'application' || modal == 'purchase') {

        var drag = $('[data-slider-'+modal+']');

        $('[data-step-form='+modal+']').owlCarousel({
          items: 1,
          nav: false,
          autoHeight: true,
          navRewind: false,
          smartSpeed: 100,
          navText: ['',''],
          mouseDrag: false,
          touchDrag: false,
          pullDrag: false,
          responsiveRefreshRate: 100,
          responsiveBaseElement: $('[data-modal]')
        });

        drag.nstSlider('refresh');

        drag.nstSlider('set_position', MainManager.MIDDLE, MainManager.MAX);

        MainManager.resizeModal(drag);
      }
    }
  };

  this.resizeModal = function(drag) {

    $(window).resize(function(){

      drag.nstSlider('refresh');

    });
  };

  this.hideModal = function (modal, clear) {

    $('[data-modal='+modal+']').removeClass('open');

    var openL = $('.modal.open').length;

    if(openL == 0) {

      $('body').removeClass('open');
    }

    if(clear) {

      MainManager.clearForm(modal);
    }
  };

  this.clearForm = function (form) {

    $('[data-step-form='+form+']').trigger('destroy.owl.carousel');

    var formId = $('#'+form+'');

    formId.find('[data-validate]').each(function(){

      MainManager.validClear($(this));

    });

    if(form == 'application' || form == 'purchase') {

      $('[data-choice-block='+form+']').addClass('no');

      $('[data-choice-'+form+']').removeClass('field-has-error');

    }

    if(form == 'purchase') {

      MainManager.confirmInfo.removeClass('field-has-error');
      MainManager.addressCheck.attr('disabled', true);
      MainManager.actAgreement.removeClass('field-has-error');
      MainManager.smsBlock.addClass('no');
      MainManager.smsBtn.removeClass('disabled');
      MainManager.actAgreement.attr('disabled', false);

    }

    formId.trigger("reset");
  };

  this.choiceParticipant = function (choice,form) {

    $('[data-choice-'+form+']').removeClass('field-has-error');

    if(choice == 'yes') {

      $('[data-choice-block='+form+']').removeClass('no');

      $('[data-step-form='+form+']').trigger('refresh.owl.carousel');

    } else {

      $('[data-choice-block='+form+']').addClass('no');

      $('[data-step-form='+form+']').trigger('refresh.owl.carousel');
    }
  };

  this.getAddress = function(el) {

    var getValue = $(el).is(':checked');
    var oldValueLast = MainManager.addressLast.val();

    if(getValue) {

      MainManager.addressLast.val(MainManager.addressFirst.val());
      MainManager.addressLast.attr('readonly', true);
      MainManager.validClear(MainManager.addressLast);

    } else {

      MainManager.addressLast.val('');
      MainManager.addressLast.attr('readonly', false);
    }
  };

  this.clearCheckBox = function(el) {
    $(el).removeClass('field-has-error')
  };

  this.getCode = function (){

    var actAgreement = MainManager.actAgreement.is(':checked');

    if(!actAgreement) {

      MainManager.actAgreement.addClass('field-has-error');

    } else {

      alert('Get sms code');
      MainManager.smsBlock.removeClass('no');
      MainManager.smsBtn.addClass('disabled');
      MainManager.actAgreement.attr('disabled', true);
      $('[data-step-form="purchase"]').trigger('refresh.owl.carousel');
    }
  };

  this.subscribeData = function(form){

    var valid = MainManager.validInit(MainManager.smsInput,MainManager.regexpAll,'Поле не должно быть пустым');

    if(valid) {

      MainManager.slideNextView(form);

    } else {

      MainManager.validError(MainManager.smsInput,'Поле не должно быть пустым');
    }
  };

}
