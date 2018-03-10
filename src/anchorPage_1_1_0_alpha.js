/**
 *AnchorPageJS Version 1.1.0 Alpha
 *Author: HerrMutig
 *License: MIT
 */
(function ($) {
    $.fn.anchorPage = function (options) {
        /***PROPERTIES***/
        var settings = $.extend({
            startMargin: 150, //top Margin for starting Anchor point. Starts the Slide on x px earlier
            endMargin: 150, //bot Margin for ending Anchor point. Starts the Slide on x px earlier
            duration: 2000, // animation duration
            waitingtime: 200, // lock scroll position for x milliseconds before user can go to the next slide
            easing: "swing" //animation easing
        }, options);


        /***Global Variables***/
        var posObjArr = []; //object Array of all Elements found for the given css-selector
        var lastMouseScroll;
        var currentPos; //current Position of the $(window) mapped as posObjArr index (integer value between minPos and maxPos)
        var maxPos; //maxium index of Anchors in posObjArr
        var minPos; //minimal index of Anchors in posObjArr
        var lockAnimation; //to prevent multiple animations be played at same time
        var wasScrollFiredBefore; //Check if scroll was fired before (Desktop only)
        var movedByWheel; //Check if scroll event was caused by mousewheel

        //Mobile
        var touchScreenStartYPos; //Startposition of touchstart Event on Screen
        var touchScreenEndYPos; //Last recorded touchmovePosition on Screen
        var touchDirection; //Detects "up" or "down" swipe
        var movedByTouch; // Check if scroll event was caused by touch
        var windowCoordsAfterTouchMove; //Window position in touchendEvent


        /***Initialization***/
        posObjArr = $(this).length > 0 ? $(this) : null;
        maxPos = posObjArr.length - 1;
        minPos = 0;
        lockAnimation = false;

        /***Functions***/

        //Get's the direction of the current scrollEvent(swipe on mobile)
        function getScrollDirection(event) 
        {
            if (event.originalEvent.deltaY === undefined) {
                return lastMouseScroll;
            } else if (event.originalEvent.deltaY < 0) {
                lastMouseScroll = "up";
                return lastMouseScroll;
            } else if (event.originalEvent.deltaY > 0) {
                lastMouseScroll = "down";
                return lastMouseScroll;
            }
        }

        function getCurrentPosition() {
            currentPos = 0;
            for (var i = 0; i < posObjArr.length; i++) {

                if ($(window).scrollTop() >= posObjArr[i].offsetTop) {
                    currentPos = i;
                }
            }
            return currentPos;
        }


        //TODO ANPASSEN
        function allowMoving(event) {
            // console.log("MAXPOS: " + maxPos + " currentPos: " + getCurrentPosition() + "ScrollDirection: " + getScrollDirection(event));
            if (movedByWheel) {
                if (minPos === getCurrentPosition() && getScrollDirection(event) === "up" || maxPos === getCurrentPosition() && getScrollDirection(event) === "down") {
                    return true;
                }
                //property start margin
                if ($(window).scrollTop() >= posObjArr[maxPos].offsetTop + settings.endMargin && getScrollDirection(event) === "up") {
                    return true;
                }
                if ($(window).scrollTop() <= posObjArr[minPos].offsetTop - settings.startMargin && getScrollDirection(event) === "down") {
                    return true;
                }

            }
            if (movedByTouch) {
                
                if (minPos === getCurrentPosition() && getTouchDirection() === "down" || maxPos === getCurrentPosition() && getTouchDirection(event) === "up") { console.log("ALLOWED");
                    return true;
                }
                //property start margin
                if ($(window).scrollTop() <= posObjArr[minPos].offsetTop - settings.startMargin && getTouchDirection(event) === "up") {                 
                    return true;
                }
                if ($(window).scrollTop() >= posObjArr[maxPos].offsetTop + settings.endMargin && getTouchDirection(event) === "down") {
                   
                    return true;
                }
            }
            return false;
        }

        function animateWindow(position) {
            $("html, body").animate({
                scrollTop: position
            }, {
                start: animateOnStart,
                complete: animateOnComplete,
                duration: settings.duration,
                easing: settings.easing
            });
        }
        //Moves to the next or prev Anchor... allowed params: "next", "prev"
        function scrollToAnchor(restriction) {
           
            
            if (lockAnimation === true)
                return;

            var scrollToAnchor = getCurrentPosition();
             console.log(scrollToAnchor);
            if (restriction === "next") {
                if ($(window).scrollTop() < posObjArr[minPos].offsetTop) // Same as in first line of this function
                {
                    scrollToAnchor = getCurrentPosition() - 1;
                }
                animateWindow(posObjArr[scrollToAnchor + 1].offsetTop);
                 console.log(scrollToAnchor);
            } else if (restriction === "prev") {

                if ($(window).scrollTop() > posObjArr[maxPos].offsetTop) // Same as in first line of this function
                {
                    scrollToAnchor = getCurrentPosition() + 1;
                }
                 //console.log(scrollToAnchor);
                animateWindow(posObjArr[scrollToAnchor - 1].offsetTop);
            }
            return false;
        }

        function animateOnComplete() {
            setTimeout(function () {
           
                    lockAnimation = false;
                },
                settings.waitingtime);
        }

        function animateOnStart() {
          
            lockAnimation = true;
        }

        //Mobile
        function setTouchDirection() {
            if (touchScreenStartYPos > touchScreenEndYPos) {
                touchDirection = "up";
            } else if (touchScreenStartYPos < touchScreenEndYPos) {
                touchDirection = "down";
            }

        }

        function getTouchDirection(deletion = false) {
            var temp = touchDirection !== undefined ? touchDirection : null;
            if (deletion === true) //If true, position willl be returned and then deleted
            {
                touchDirection = null;
            }
            return temp;
        }


        /***Event Functions***/
        function EventScrollToSection(e) {
            movedByWheel = true;
            movedByTouch = false;
            if (allowMoving(e)) {
                return;
            }


            e.preventDefault();
            if (getScrollDirection(e) === "up") {
                scrollToAnchor("prev");
            } else if (getScrollDirection(e) === "down") {
                scrollToAnchor("next");
            }
        }

        function blockOverflowedMouseScrolling(event) {
            
            if (!allowMoving(event) && wasScrollFiredBefore === false) {
                if (getCurrentPosition() === minPos) {
                    $(window).scrollTop(posObjArr[minPos].offsetTop - settings.startMargin);
                } else if (getCurrentPosition() === maxPos) {
                    $(window).scrollTop(posObjArr[maxPos].offsetTop + settings.endMargin);
                }
               wasScrollFiredBefore = true;
            } else if (allowMoving(event)) {

                wasScrollFiredBefore = false;
            }
        }

        function blockOverflowedTouchScrolling(event) {
            if (!allowMoving(event) && wasScrollFiredBefore === false)
            {
                if (getCurrentPosition() === minPos) {
                    $(window).scrollTop(posObjArr[minPos].offsetTop - settings.startMargin);
                } else if (getCurrentPosition() === maxPos) {
                    $(window).scrollTop(posObjArr[maxPos].offsetTop + settings.endMargin);
                }
                wasScrollFiredBefore = true;
            }
            else if (allowMoving(event))
            {
                wasScrollFiredBefore = false;
            }
        }

        function EventScrollBlock(e) {
            if (movedByWheel === true) {
                blockOverflowedMouseScrolling(e);
            }
            if (movedByTouch === true) {
                blockOverflowedTouchScrolling(e);
            }

        }

        //MOBILE
        function EventTouchStart(e) {
            touchScreenStartYPos = e.touches[0].screenY;
            movedByWheel = false;
            movedByTouch = true;
        }

        function EventTouchMove(e) {
            if (!allowMoving(e)) {
                e.preventDefault();
            }
            
            touchScreenEndYPos = e.touches[0].screenY;
            setTouchDirection();
        }

        function EventTouchToSection(e) {
            console.log(getTouchDirection());
            windowCoordsAfterTouchMove = $(window).scrollTop();
            if (allowMoving(e)) {
                getTouchDirection(true);
                return;
            }

            if (getTouchDirection() === "down") 
            {
                scrollToAnchor("prev");
            } 
            else if (getTouchDirection() === "up") 
            {
                scrollToAnchor("next");
            }
            getTouchDirection(true);
        }

        /***Event Bindings***/
        $(window).on("wheel", EventScrollToSection);
        $(window).on("scroll", EventScrollBlock);

        //JQuery doesn't support options on EventListener
        window.addEventListener("touchstart", EventTouchStart);
        window.addEventListener("touchmove", EventTouchMove, {
            passive: false,
            cancelable: true,
            cancelBubble: true
        });
        $(window).on("touchend", EventTouchToSection);
    };
}(jQuery));
