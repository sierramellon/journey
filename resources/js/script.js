$(document).ready(function(){

    var goal = "";
    var goal_response = "";
  
    /*For the sticky navigation */
    $('.js--section-features').waypoint(function(direction){
        if (direction=="down"){
            $('nav').addClass('sticky');
        }
        else {
            $('nav').removeClass('sticky');
        }
    }, {
            offset: '60px'
    });
    
    
    /* Scroll on buttons */
    $('.js--scroll-to-plans').click(function(){
        $('html, body').animate({scrollTop: $('.js--section-plans').offset().top}, 1000);
    });
    
    $('.js--scroll-to-start').click(function(){
        $('html, body').animate({scrollTop: $('.js--section-features').offset().top}, 1000);
    });

    /* Navigations */
    var current_section = '.section-intro';
    $(current_section).toggleClass('show');

    goal_response_callback = function(data) {
        if (data === "LOADING") {
            $.get("https://superb-binder-140518.appspot.com/api/processgoal?goal=" + goal, goal_response_callback);
        } else {
            goal_response = data;
            $(".goal_response").text("REI Journey will help you with your concern of " + goal_response);
        }
    }

    var navigation_instructions = {
        '.nav-to-create-goal': null,
        '.nav-to-signup': function() {
            event.preventDefault();
            goal = $("#goal").val();
            $(".goal_text").text(goal);
            $.get("https://superb-binder-140518.appspot.com/api/processgoal?goal=" + goal, goal_response_callback);
        },
        '.nav-to-home': function() {event.preventDefault();},
        '.nav-to-weekly-plan': null,
        '.nav-to-daily-plan': null,
        '.nav-to-view-goal': null,
        '.nav-to-history': null
    }

    // setup navigation event handlers
    for (var instruction in navigation_instructions) {
        if (navigation_instructions.hasOwnProperty(instruction)) {
            $(instruction).click(function(instruction) {
                return function() {
                    if (navigation_instructions[instruction]) {
                        navigation_instructions[instruction]();
                    }
                    $(current_section).toggleClass('show');
                    current_section = instruction.replace('nav-to', 'section');
                    $(current_section).toggleClass('show');
                }
            }(instruction));
        }
    }
    
    /* Check and uncheck daily plan for outdoor and indoor */
    $('#unchecked-out').click(function() {
        $('#unchecked-out').css('display', 'none');
        $('#checked-out').css('display', 'block');
    });
    
    $('#checked-out').click(function() {
        $('#checked-out').css('display', 'none');
        $('#unchecked-out').css('display', 'block');
    });
    
    $('#unchecked-in').click(function() {
        $('#unchecked-in').css('display', 'none');
        $('#checked-in').css('display', 'block');
    });
    
    $('#checked-in').click(function() {
        $('#checked-in').css('display', 'none');
        $('#unchecked-in').css('display', 'block');
    });
    
    /* Navigation scroll */
    $(function() {
      $('a[href*="#"]:not([href="#"])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
          if (target.length) {
            $('html, body').animate({
              scrollTop: target.offset().top
            }, 1000);
            return false;
          }
        }
      });
    });
    
    /* Animation on scroll */
    $('.js--wp-1').waypoint(function(direction){
        $('.js--wp-1').addClass('animated fadeIn');
    }, {
        offset: '50%'
    });
    
    $('.js--wp-2').waypoint(function(direction){
        $('.js--wp-2').addClass('animated fadeInUp');
    }, {
        offset: '50%'
    });
    
    $('.js--wp-3').waypoint(function(direction){
        $('.js--wp-3').addClass('animated fadeIn');
    }, {
        offset: '50%'
    });
    
    $('.js--wp-4').waypoint(function(direction){
        $('.js--wp-4').addClass('animated pulse');
    }, {
        offset: '50%'
    });
    
    /* mobile navigation */
    $('.js--nav-icon').click(function(){
        var nav = $('.js--main-nav');
        var icon = $('.js--nav-icon i');
        
        nav.slideToggle(200);
        if(icon.hasClass('ion-navicon-round')){
            icon.addClass('ion-close-round');
            icon.removeClass('ion-navicon-round');
        }else {
            icon.addClass('ion-navicon-round');
            icon.removeClass('ion-close-round');
        }
        
    });
    
    /* Maps */
    var map = new GMaps({
      div: '.map',
      lat: 38.7436056,
      lng: -9.05,
      zoom: 12
    });
    
    map.addMarker({
      lat: 38.7436056,
      lng: -9.2304155,
      title: 'Lisbon',
      infoWindow: {
          content: '<p>Our Lisbon HQ</p>'
        }
    });

});