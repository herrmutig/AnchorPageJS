# AnchorPageJS(Current Version: 1.2.4)
AnchorPageJS is a webpage-scroller, which allows you to scroll to specific points on your webpage. You can create beautiful Full-Page Pages or a mix of Full-Page and scrollable(non full-page) websites! You can use it to just scroll automatically to a specific point on your webpage as well!

### Requirements
AnchorPageJS requires JQuery (tested with JQuery V.3.3.1) with animation extension.

### Examples
There are no Examples at the moment. But will be coming in the next two Weeks. 

### Installation
Just include the anchorPage_[VERSION].min.js or the anchorPage_[VERSION].js into your project and AFTER the JQuery include.
Good Job! It should work now.

### Usage
First create some HTML-Tags and give them a class:

```html
    <div class="exampleClass"><!--Your Content goes here--></div>
    <div class="exampleClass"><!--Your Content goes here--></div>
    <div class="exampleClass"><!--Your Content goes here--></div>
    <div class="exampleClass"><!--Your Content goes here--></div>
    <div class="exampleClass"><!--Your Content goes here--></div>
    <div class="exampleClass"><!--Your Content goes here--></div>
```
With that being done, you can initiate it by just adding the following in a ```html <script>``` Tag for example.

```javascript
     $(function() //Jquery Ready function
    {
    //Maybe some JS
        $(".exampleClass").anchorPage(); // initialize anchorPage
    //Maybe some JS
    });
```
You can use more than one class too:

```javascript
     $(function() //Jquery Ready function
    {
    //Maybe some JS
        $(".exampleClass, .exampleClass2, .exampleClass3").anchorPage(); // initialize anchorPage
    //Maybe some JS
    });
```
Or for a more advanced initialization you can use some options:

```javascript
        $(".exampleClass").anchorPage({
            duration: 5000,
            startMargin: 200,
            endMargin: 200,
            easing: "swing",
            waitingtime: 150          
        }); 
```

### Options
`duration`: the time in milliseconds how long the scroll animation last (NUMBER)

`easing`: easing of the animation (e.g: linear, swing)

`waitingtime`: the time in milliseconds the user has to wait before he is allowed to scroll to the next (or previous) Anchor (NUMBER)

`startMargin`: the margin measured by the very first given anchor before it starts the Animation (NUMBER)

`endMargin`: same as startMargin but with the very last given Anchor

### Changelog
12.03.2018:

Release: Version 1.2.4

- Feature: Added smoother Scrolling when offset is set

- Bugfix: If more than one time initiated, no weird behaviour anymore

- Bugfix: cutted appearence on more complex html structure fixed

- Bugfix: Weird scrolling behaviour (flickers) fixed

10.3.2018:

Final Version Release: 1.1.1

- Bugfix: Scrolling will no longer skip sections

- Bugfix: Fast Scrolling won't affect startMargin anymore

Version 1.1.0 Alpha

- Feature: Added Mobile Swiping Support

### Planned Features
- responsive breakpoints
- more animations
- Scrolling for elements and not only for the Browserwindow

### Bugs
No Bugs known Hurray!
