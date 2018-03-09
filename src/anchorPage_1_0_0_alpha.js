/**
*AnchorPageJS Version 1.0.0 Alpha
*Author: HerrMutig
*License: MIT
*/
(function ($) {
    $.fn.anchorPage = function (options) {
        //propertiesSTART
        var settings = $.extend({
            startMargin: 150, //top Margin for starting Anchor point. Starts the Slide on x px earlier
            endMargin: 150, //bot Margin for ending Anchor point. Starts the Slide on x px earlier
            duration: 2000, // animation duration
            waitingtime: 200, // lock scroll position for x milliseconds before user can go to the next slide
            easing: "swing" //animation easing
        }, options);
        //propertiesEND

        //Global Variables
        var posObjArr = []; //object Array of all Elements found for the given css-selector
        var lastMouseScroll;
        var currentPos; //current Position of the $(window) mapped as posObjArr index (integer value between minPos and maxPos)
        var maxPos; //maxium index of Anchors in posObjArr
        var minPos; //minimal index of Anchors in posObjArr
        var lockAnimation;
        var wasScrollFired;
        //Initialisations
        posObjArr = $(this).length > 0 ? $(this) : null;
        maxPos = posObjArr.length - 1;
        minPos = 0;
        lockAnimation = false;
        //functions
        //TODO for Mobile

        /*
         * Get's the direction of the current scrollEvent(swipe on mobile)
         */
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

        function getCurrentPosition() {
            currentPos = 0;
            for (var i = 0; i < posObjArr.length; i++) {

                if ($(window).scrollTop() >= posObjArr[i].offsetTop) {
                    currentPos = i;
                }
            }
            return currentPos;
        }

        function allowScrolling(event) {
            // console.log("MAXPOS: " + maxPos + " currentPos: " + getCurrentPosition() + "ScrollDirection: " + getScrollDirection(event));
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

        /*
         * Moves to the next or prev Anchor... allowed params: "next", "prev"
         */
        function scrollToAnchor(restriction) {

            if (lockAnimation === true)
                return;

            var scrollToAnchor = getCurrentPosition();

            if (restriction === "next") {
                if ($(window).scrollTop() < posObjArr[minPos].offsetTop) // Same as in first line of this function
                {
                    scrollToAnchor = getCurrentPosition() - 1;
                }
                animateWindow(posObjArr[scrollToAnchor + 1].offsetTop);

            } else if (restriction === "prev") {

                if ($(window).scrollTop() > posObjArr[maxPos].offsetTop) // Same as in first line of this function
                {
                    scrollToAnchor = getCurrentPosition() + 1;
                }
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


        //Event functions
        function EventScrollToSection(e) {
            if (allowScrolling(e)) {
                return;
            }


            e.preventDefault();
            if (getScrollDirection(e) === "up") {
                scrollToAnchor("prev");
            } else if (getScrollDirection(e) === "down") {
                scrollToAnchor("next");
            }
        }


        function EventScrollBlock(e) {
            {
                if (!allowScrolling(e) && wasScrollFired === false) {
                    if (getCurrentPosition() === minPos) {
                        $(window).scrollTop(posObjArr[minPos].offsetTop - settings.startMargin);
                    } else if (getCurrentPosition() === maxPos) {
                        $(window).scrollTop(posObjArr[maxPos].offsetTop + settings.endMargin);
                    }

                    wasScrollFired = true;
                } else if (allowScrolling(e)) {
                    wasScrollFired = false;
                }

            }
        }

        //Event bindings
        $(window).on("wheel", EventScrollToSection);
        $(window).on("scroll", EventScrollBlock);


    };
}(jQuery));
