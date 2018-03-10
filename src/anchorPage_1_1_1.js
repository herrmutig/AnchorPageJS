/**
 *AnchorPageJS Version 1.1.1
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

        /***GLOBAL VARIABLES***/

        var posObjArr = [];
        var currentPos;
        var maxPos;
        var minPos;
        var lockAnimation;
        var movedByWheel;
        var lastMouseScroll;

        //Mobile
        var touchScreenStartYPos;
        var touchScreenEndYPos;
        var movedByTouch;
        var touchDirection;


        /***Initialization***/
        posObjArr = $(this).length > 0 ? $(this) : null;
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

        function animateOnStart() {
            lockAnimation = true;
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

        function allowMoving(event) {
            // console.log("MAXPOS: " + maxPos + " currentPos: " + getCurrentPosition() + "ScrollDirection: " + getScrollDirection(event));
            if (movedByWheel) {
                if (minPos === getCurrentPosition() && getScrollDirection(event) === "up" || maxPos === getCurrentPosition() && getScrollDirection(event) === "down") {
                    return true;
                }
                //property start margin
                if ($(window).scrollTop() > posObjArr[maxPos].offsetTop + settings.endMargin && getScrollDirection(event) === "up") {
                    return true;
                }
                if ($(window).scrollTop() < posObjArr[minPos].offsetTop - settings.startMargin && getScrollDirection(event) === "down") {
                    return true;
                }

            }
            if (movedByTouch) {       
                if (minPos === getCurrentPosition() && getTouchDirection() === "down" || maxPos === getCurrentPosition() && getTouchDirection(event) === "up") {
                    return true;
                }
                //property start margin
                if ($(window).scrollTop() < posObjArr[minPos].offsetTop - settings.startMargin && getTouchDirection(event) === "up") {
                    return true;
                }
                if ($(window).scrollTop() > posObjArr[maxPos].offsetTop + settings.endMargin && getTouchDirection(event) === "down") {
                    return true;
                }
            }
            return false;
        }



        function scrollToAnchor(restriction) {
            if (lockAnimation === true)
                return;
            var scrollToAnchor = getCurrentPosition();
            if (restriction === "next") {
                if ($(window).scrollTop() < posObjArr[minPos].offsetTop) {
                    scrollToAnchor = getCurrentPosition() - 1;
                }
                animateWindow(posObjArr[scrollToAnchor + 1].offsetTop);
            } else if (restriction === "prev") {

                if ($(window).scrollTop() > posObjArr[maxPos].offsetTop) {
                    scrollToAnchor = getCurrentPosition() + 1;
                }

                animateWindow(posObjArr[scrollToAnchor - 1].offsetTop);
            }
            return false;
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
        //Desktop
        function getScrollDirection(event) {
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

        function blockExceededMouseScrolling(event) {
            //If no animation is played but a scroll happens it checks if scroll is valid
            if (!allowMoving(event) && lockAnimation === false) {
                if (getCurrentPosition() === minPos) {
                    $(window).scrollTop(posObjArr[minPos].offsetTop - settings.startMargin);
                } else if (getCurrentPosition() === maxPos) {
                    $(window).scrollTop(posObjArr[maxPos].offsetTop + settings.endMargin);
                }
            }
        }

        //Mobile

        function blockExceededTouchScrolling(event) {
            if (!allowMoving(event) && lockAnimation === false) {
                if (getCurrentPosition() === minPos) {
                    $(window).scrollTop(posObjArr[minPos].offsetTop - settings.startMargin);
                } else if (getCurrentPosition() === maxPos) {
                    $(window).scrollTop(posObjArr[maxPos].offsetTop + settings.endMargin);
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
            blockExceededMouseScrolling(event);
        }



        //Mobile
        function EventTouchStart(event) {
            touchScreenStartYPos = event.touches[0].screenY;
            movedByWheel = false;
            movedByTouch = true;

        }

        function EventTouchMove(event) {
            if (!allowMoving(event)) {
               event.preventDefault();
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
        $(window).on("wheel", EventScrollToSection);
        $(window).on("scroll", EventScrollBlock);

        //JQuery doesn't support options on EventListener
        window.addEventListener("touchstart", EventTouchStart);
        window.addEventListener("touchmove", EventTouchMove, {
            passive: false, cancelable: true, cancelBubble: true
        });
        window.addEventListener("touchend", EventTouchToSection);

    };
}(jQuery));
