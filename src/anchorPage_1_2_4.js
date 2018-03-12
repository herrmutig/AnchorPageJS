/**
 *AnchorPageJS Version 1.2.4
 *Author: HerrMutig
 *License: MIT
 */

Fixed Weird sliding animations
(function ($) {
    var anchorPageFunctionCalls = 0;
    $.fn.anchorPage = function (options) {
        /***PROPERTIES***/
        var settings = $.extend({
            startMargin: 150, //top Margin for starting Anchor point. Starts the Slide on x px earlier
            endMargin: 150, //bot Margin for ending Anchor point. Starts the Slide on x px earlier
            duration: 2000, // animation duration
            waitingtime: 200, // lock scroll position for x milliseconds before user can go to the next slide
            easing: "swing" //animation easing
        }, options);

        /***GLOBAL VARIABLES***/
        
        var posObjArr = [];
        var currentPos;
        var maxPos;
        var minPos;
        var lockAnimation;
        
        //Desktop
        var movedByWheel;
        var lastMouseScroll;

        //Mobile
        var touchScreenStartYPos;
        var touchScreenEndYPos;
        var movedByTouch;
        var touchDirection;
        
        posObjArr = $(this).length > 0 ? $(this) : null;
        /***Valid Input Checking***/
        if(posObjArr === null)
            return;
        if(anchorPageFunctionCalls > 1)         //Kills function if called more than once
            return;
        
        anchorPageFunctionCalls++;
        
        /***Initialization***/
        maxPos = posObjArr.length - 1;
        minPos = 0;
        lockAnimation = false;
        
        
        
        /***Functions***/
        function animateOnComplete() {
            setTimeout(function () {

                    lockAnimation = false;
                },
                settings.waitingtime);
        }

        function animateOnStart(e) {
            while($(this).queue().length >  1) //if more than one animation will get played. Delete whole queue but not the one which is running atm
            {
                $(this).stop();
            }
              

            //Locks further animation for the time of settings.waitingtime
           lockAnimation = true;
        }
        function animationOnRun()
        {      
           

        }

        function animateWindow(position) {
            $("html, body").animate({
                scrollTop: position
            }, {
                start: animateOnStart,
                step: animationOnRun,
                complete: animateOnComplete,
                duration: settings.duration,
                easing: settings.easing
            });
        }

        function allowMoving(event) {
          
       //     console.log("PosObjArr: " + ($(posObjArr[getCurrentPosition()]).offset().top + settings.endMargin));
            if (movedByWheel) {
                if (minPos === getCurrentPosition() && getScrollDirection(event) === "up" || maxPos === getCurrentPosition() && getScrollDirection(event) === "down") {
                    return true;
                    
                }
                //property start margin
                if ($(window).scrollTop() > Math.round($(posObjArr[maxPos]).offset().top + settings.endMargin) && getScrollDirection(event) === "up") {
                   return true;
                          
                }
                if ($(window).scrollTop() < Math.round($(posObjArr[minPos]).offset().top - settings.startMargin) && getScrollDirection(event) === "down") {
                   return true;
              
                }

            }
            if (movedByTouch) {       
                if (minPos === getCurrentPosition() && getTouchDirection() === "down" || maxPos === getCurrentPosition() && getTouchDirection(event) === "up") {
                    return true;
                }
                //property start margin
                if ($(window).scrollTop() < Math.round($(posObjArr[minPos]).offset().top - settings.startMargin) && getTouchDirection(event) === "up") {
                    return true;
                }
                if ($(window).scrollTop() > Math.round($(posObjArr[maxPos]).offset().top + settings.endMargin) && getTouchDirection(event) === "down") {
                    return true;
                }
            }
            return false;
        }



        function scrollToAnchor(restriction) {
            movedByWheel = false;
            movedByTouch = false;
            if (lockAnimation === true)
                return;
            
            var scrollToAnchor = getCurrentPosition();
            if (restriction === "next") {
                if ($(window).scrollTop() < Math.round($(posObjArr[minPos]).offset().top)) {
                    scrollToAnchor = getCurrentPosition() - 1;
                }
                animateWindow(Math.round($(posObjArr[scrollToAnchor + 1]).offset().top));
            } else if (restriction === "prev") {

                if ($(window).scrollTop() > Math.round($(posObjArr[maxPos]).offset().top)) {
                    scrollToAnchor = getCurrentPosition() + 1;
                }

                animateWindow(Math.round($(posObjArr[scrollToAnchor - 1]).offset().top));
            }
            return false;
        }
        

        function setCurrentPosition()
        {
            currentPos = 0;
            for (var i = 0; i < posObjArr.length; i++) 
            {
                if ($(window).scrollTop() >= Math.round($(posObjArr[i]).offset().top)) 
                {
                    currentPos = i;
                }
            }
           // console.log("POSITION: "+ currentPos);
        }

        function getCurrentPosition() {
            if(currentPos === undefined)
                setCurrentPosition();
            return currentPos;
        }
        //Desktop
        function getScrollDirection(event) {
            if (event.originalEvent === undefined) {
                return lastMouseScroll === undefined ? -1 : lastMouseScroll;
            } else if (event.originalEvent.deltaY < 0) {
                lastMouseScroll = "up";
                return lastMouseScroll;
            } else if (event.originalEvent.deltaY > 0) {
                lastMouseScroll = "down";
                return lastMouseScroll;
            }
        }

        function blockExceededMovementScrolling(event) {
        //console.log("Window: " + $(window).scrollTop(3299));
            //If no animation is played but a scroll happens it checks if scroll is valid
            if (!allowMoving(event) && lockAnimation === false) 
            {          
                    if(getCurrentPosition() === minPos)
                    {
                         scrollToAnchor("next"); //Smooth Scrolling
                    }
                    else if (getCurrentPosition() === maxPos)
                    {                       
                        scrollToAnchor("prev"); //Smooth Scrolling
                    }
            }
        }

        function setTouchDirection() {
            if (touchScreenStartYPos > touchScreenEndYPos) {
                touchDirection = "up";
            } else if (touchScreenStartYPos < touchScreenEndYPos) {
                touchDirection = "down";
            }
        }

        function getTouchDirection(deletion) {
            var temp = touchDirection !== undefined ? touchDirection : null;
            if (deletion === true) //If true, position willl be returned and then deleted
            {
                touchDirection = null;
            }
            return temp;
        }

        /***Event Functions***/
        //Desktop
        function EventScrollToSection(event) {
           
            movedByWheel = true;
            movedByTouch = false;
            getScrollDirection(event);
            setCurrentPosition();
            if (allowMoving(event)) {
                return;
            }           
            event.preventDefault();
            if (getScrollDirection(event) === "up") {
                scrollToAnchor("prev");
            } else if (getScrollDirection(event) === "down") {
                scrollToAnchor("next");
            }
        }


        function EventScrollBlock(event) {
            if(movedByTouch || movedByWheel)
                blockExceededMovementScrolling(event);
        }



        //Mobile
        function EventTouchStart(event) 
        {
            touchScreenStartYPos = event.touches[0].screenY;
            movedByWheel = false;
            movedByTouch = true;
            setCurrentPosition();

        }

        function EventTouchMove(event) {
            if (!allowMoving(event)) {
               //event.preventDefault();
            }

            touchScreenEndYPos = event.touches[0].screenY;
            setTouchDirection();
        }

        function EventTouchToSection(event) {
            if (allowMoving(event)) {
                getTouchDirection();
                return;
            }

            if (getTouchDirection() === "down") {
                scrollToAnchor("prev");
            } else if (getTouchDirection() === "up") {
                scrollToAnchor("next");
            }
            getTouchDirection(true);
        }



        /***Event Bindings***/
        
        
        //JQuery doesn't support options on EventListener
        window.addEventListener("scroll", EventScrollBlock, {passive: true});
        $(window).on("wheel", EventScrollToSection);
        $(window).on("resize ", function(){});
        window.addEventListener("touchstart", EventTouchStart);
        window.addEventListener("touchmove", EventTouchMove, {passive: false, cancelable: true, cancelBubble: true});
        window.addEventListener("touchend", EventTouchToSection);
      
        

    };
    
    
}(jQuery));
