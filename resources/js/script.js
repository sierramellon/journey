$(document).ready(function(){

    var goal = "";
    var goal_response = "";
    var today = "";
    var activity_plan = {};
    /*
    var activity_plan = {
        "Monday": {
            "Outdoor": {
                "activity": "50 minutes - Bicycling along Golden Gate Bridge",
                "finished": false
            },
            "Indoor": {
                "activity": "50 minutes - High knee jumping",
                "finished": false
            }
        },
        "Tuesday": {
            "Outdoor": {
                "activity": "45 minutes - Jogging on Market Street",
                "finished": false
            },
            "Indoor": {
                "activity": "45 minutes - Push-ups and situps",
                "finished": false
            }   
        },
        "Wednesday": {
            "Outdoor": {
                "activity": "45 minutes - Swimming in San Francisco recreational center",
                "finished": false
            },
            "Indoor": {                
                "activity": "30 minutes - Rope jumpping",
                "finished": false
            }                
        },
        "Thursday": {
            "Outdoor": {
                "activity": "45 minutes - Jogging on Market Street",
                "finished": false
            },
            "Indoor": {                    
                "activity": "45 minutes - Abs exercise combo",
                "finished": false
            }                  
        },
        "Friday": {
            "Outdoor": {
                "activity": "45 minutes - Jogging on Market Street",
                "finished": false
            },
            "Indoor": {                   
                "activity": "35 minutes - Treadmills",
                "finished": false
            }                  
        },
        "Saturday": {
            "Outdoor": {
                "activity": "45 minutes - Hiking on twin peaks",
                "finished": false
            },
            "Indoor": {                      
                "activity": "45 minutes - Weight training",
                "finished": false
            }                  
        },
        "Sunday": {
            "Outdoor": {
                "activity": "60 minutes - Yoga in golden gate park",
                "finished": false
            },
            "Indoor": {                   
                "activity": "45 minutes - Indoor cycling",
                "finished": false
            }                  
        }
    };
    */
  
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
        $('html, body').animate({scrollTop: $('.js--section-profile').offset().top}, 1000);
    });
    
    $('.js--scroll-to-start').click(function(){
        $('html, body').animate({scrollTop: $('.js--section-features').offset().top}, 1000);
    });

    /* Getting the AI generated label from server */
    var goal_response_callback = function(data) {
        if (data === "LOADING") {
            $.get("https://superb-binder-140518.appspot.com/api/processgoal?goal=" + goal, goal_response_callback);
        } else {
            goal_response = data;
            $(".goal_response").text("REI Journey will help you with your concern of " + goal_response);
        }
    }

    /* Getting the AI generated activities */
    var get_activity_response_callback = function(data) {
        activity_plan = JSON.parse(data);
    }

    /* Navigations */
    var navigation_instructions = {
        '.nav-to-create-goal': null,
        '.nav-to-signup': function(element) {
            event.preventDefault();
            // update goal DOM text
            goal = $("#goal").val();
            $(".goal_text").text(goal);
            // retrieve health information from device
            confirm("Please allow REI Journey to access your health data in order to provide you with a better exercise plan");
            // retrieve AI label and activity plans from server
            $.get("https://superb-binder-140518.appspot.com/api/processgoal?goal=" + goal, goal_response_callback);
            $.get("https://superb-binder-140518.appspot.com/api/getactivities?goal=" + goal, get_activity_response_callback);
        },
        '.nav-to-home': function() {event.preventDefault();},
        '.nav-to-weekly-plan': null,
        '.nav-to-daily-plan': function(element) {
            today = element["id"];
            $(".day-in-daily-plan").text(today);
            $("#outdoor_activity").text(activity_plan[today]["Outdoor"]["activity"]);         
            if (activity_plan[today]["Outdoor"]["finished"]) {
                mark_outdoor_finished();
            } else {
                mark_outdoor_unfinished();
            }

            $("#indoor_activity").text(activity_plan[today]["Indoor"]["activity"]);
            if (activity_plan[today]["Indoor"]["finished"]) {
                mark_indoor_finished();
            } else {
                mark_indoor_unfinished();
            }
        },
        '.nav-to-view-goal': null,
        '.nav-to-history': null,
        '.nav-to-profile': null
    }

    // setup navigation event handlers
    var sections = [];
    sections.peek = function() {
        if (sections.length == 0) {
            return null;
        } else {
            return sections[sections.length - 1];
        }
    };
    sections.push('.section-intro');
    $(sections.peek()).toggleClass('show');
    for (var instruction in navigation_instructions) {
        if (navigation_instructions.hasOwnProperty(instruction)) {
            $(instruction).click(function(instruction) {
                return function() {
                    if (navigation_instructions[instruction]) {
                        navigation_instructions[instruction](this);
                    }
                    $(sections.peek()).toggleClass('show');
                    sections.push(instruction.replace('nav-to', 'section'));
                    $(sections.peek()).toggleClass('show');
                }
            }(instruction));
        }
    }

    $('.nav-back').click(function() {
        $(sections.pop()).toggleClass('show');
        $(sections.peek()).toggleClass('show');
    });
    
    /* Check and uncheck daily plan for outdoor and indoor */
    var mark_outdoor_finished = function() {
        $('#unchecked-out').css('display', 'none');
        $('#checked-out').css('display', 'block');
        activity_plan[today]["Outdoor"]["finished"] = true;
    };
    var mark_outdoor_unfinished = function() {
        $('#checked-out').css('display', 'none');
        $('#unchecked-out').css('display', 'block');
        activity_plan[today]["Outdoor"]["finished"] = false;
    };
    var mark_indoor_finished = function() {
        $('#unchecked-in').css('display', 'none');
        $('#checked-in').css('display', 'block');
        activity_plan[today]["Indoor"]["finished"] = true;
    };
    var mark_indoor_unfinished = function() {
        $('#checked-in').css('display', 'none');
        $('#unchecked-in').css('display', 'block');
        activity_plan[today]["Indoor"]["finished"] = false;
    };

    $('#unchecked-out').click(mark_outdoor_finished); 
    $('#checked-out').click(mark_outdoor_unfinished);    
    $('#unchecked-in').click(mark_indoor_finished);   
    $('#checked-in').click(mark_indoor_unfinished);
    
    // feeback icon on history page
    var mark_feedback_yes = function() {
        $("#feedback-no").css('display', 'none');
        $("#feedback-yes").css('display', 'block');   
    };
    var mark_feedback_no = function() {
        $("#feedback-yes").css('display', 'none');
        $("#feedback-no").css('display', 'block');   
    };
    
    $('#feedback-no').click(mark_feedback_yes); 
    $('#feedback-yes').click(mark_feedback_no);    
    
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
    /*
    $('.js--wp-1').waypoint(function(direction){
        $('.js--wp-1').addClass('animated fadeIn');
    }, {
        offset: '50%'
    });*/
    
    
    $('.js--wp-1').addClass('animated fadeIn');
    $('.js--delay-1').addClass('animated fadeInRight');
    $('.js--wp-2').addClass('animated fadeInUp');
    $('.js--wp-3').addClass('animated fadeIn');
    $('.js--wp-4').addClass('animated pulse');
    
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

});