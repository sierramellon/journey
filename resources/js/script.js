$(document).ready(function(){

    // some global states
    var goal = "";
    var goal_response = "";
    var today = "";
    var activity_plan = {};
    var user_info = {};

    /* Getting the AI generated label from server */
    var goal_response_callback = function(data) {
        if (data === "LOADING") {
            $.get("/api/processgoal?goal=" + goal, goal_response_callback);
        } else {
            goal_response = data;
            $(".label-info").text("REI Journey will help you with your concern of " + goal_response);
        }
    }

    /* Getting the AI generated activities */
    var get_activity_response_callback = function(data) {
        activity_plan = JSON.parse(data);
    }

    /* Getting the user info from backend */
    var get_user_info_response_callback = function(data) {
        user_info = JSON.parse(data);
        for (var attr in user_info) {
            if (user_info.hasOwnProperty(attr)) {
                if (attr === "image") {
                    $("." + attr + "-info").attr("src", user_info[attr]);         
                } else if (attr === "label") {
                    $(".label-info").text("REI Journey will help you with your concern of " + user_info[attr]);
                }else {
                    $("." + attr + "-info").text(user_info[attr]);
                }
            }
        }
    }

    /* Navigations */
    var navigation_instructions = {
        '.nav-to-intro': function() {
            $("#goal").val("");
            $("#email-signup").val("");
            $("#pwd").val("");
            $("#repwd").val("");
            $("#email-login").val("");
            $("#pwd-login").val("");
        },
        '.nav-to-create-goal': null,
        '.nav-to-login': null,
        '.nav-to-signup': function(element) {
            event.preventDefault();
            // update goal DOM text
            goal = $("#goal").val();         
            $(".goal-info").text(goal);
            // retrieve health information from device
            confirm("Please allow REI Journey to access your health data to provide you with a better exercise plan");
            // retrieve AI label and activity plans from server
            $.get("/api/processgoal?goal=" + goal, goal_response_callback);
            $.get("/api/getactivities?goal=" + goal, get_activity_response_callback);
        },
        '.nav-to-home': function() {
            event.preventDefault();
            var email = "";
            if ($("#email-signup").val()) {
                email = $("#email-signup").val();
            } else {
                email = $("#email-login").val();
            }
            
            // retrieve user information from server
            $.get("/api/userinfo?email=" + email, get_user_info_response_callback);
        },
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
                    // special naviation per section
                    if (navigation_instructions[instruction]) {
                        navigation_instructions[instruction](this);
                    }
                    // general navigation
                    $(sections.peek()).toggleClass('show');
                    sections.push(instruction.replace('nav-to', 'section'));
                    $(sections.peek()).toggleClass('show');
                }
            }(instruction));
        }
    }

    // back button navigation
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
    
    // Feeback icons on history page
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
    
    $('.js--wp-1').addClass('animated fadeIn');
    $('.js--delay-1').addClass('animated fadeInRight');
    $('.js--wp-2').addClass('animated fadeInUp');
    $('.js--wp-4').addClass('animated pulse');
});