var currentInput = null;

/** section: Core API
 * class Input
 *
 * Contains information and utility methods concerning player input for games.
 * This covers mouse movement, mouse clicks, and key presses.
 **/
function Input(game) {
    
    
    var downMouseButtons = {},
    self = this;

    EventEmitter.call(self);

    self['game'] = game;
    self['_k'] = {};
    

    /**
     * Input.observe(eventName, handler) -> Input
     * - eventName (String): The name of the input event to observe. See below.
     * - handler (Function): The function to execute when `eventName` occurs.
     *
     * Sets the engine to call Function `handler` when input event `eventName`
     * occurs from the user. Allowed `eventName` values are:
     *
     *  - `keydown`: Called when a key is pressed down. The term "key" is meant
     *               to be used loosley, as in, a game client that contains a
     *               keyboard should call this for each key pressed. If the client
     *               contains is a portable gaming device, this should be called
     *               for each button pressed on the controller. The `Input.KEY_*`
     *               values should be used as the "basic" keyCode values.
     *               Optionally, the `keyCode` property in the argument object
     *               can be used to determine more precisely which key was pressed.
     *
     *  - `keyup`: Called when a key is released. See `keydown` above for more
     *             details.
     *
     *  - `mousemove`: Called continually as the mouse moves across the game screen.
     *                 The `x` and `y` properties in the argument object can be
     *                 used to determine the mouse position.
     *
     *  - `mousedown`: Called when any of the mouse keys are pressed down. The
     *                 `button` value in the argument object can be used to
     *                 determine which mouse button was pressed, along with `x`
     *                 and `y` to determine where on the screen the button was
     *                 pressed down.
     *
     *  - `mouseup`: Called when any of the mouse keys are released. The
     *               `button` value in the argument object can be used to
     *               determine which mouse button was pressed, along with `x`
     *               and `y` to determine where on the screen the button was
     *               pressed released.
     *                 
     **/
    /**
     * Input.stopObserving(eventName, handler) -> Input
     * - eventName (String): The name of the input event to stop observing.
     * - handler (Function): The function to remove from execution.
     *
     * Detaches Function `handler` from event `eventName`. See the description
     * and list of events in [[Input.observe]] for more information on the
     * allowed `eventName` values.
     **/
}

inherits(Input, EventEmitter);

/**
 * Input#pointerX -> Number
 *
 * The current X coordinate of the mouse pointer.
 **/
Input.prototype['pointerX'] = 0;
/**
 * Input#pointerY -> Number
 *
 * The current Y coordinate of the mouse pointer.
 **/
Input.prototype['pointerY'] = 0;
/**
 * Input#isKeyDown(keyCode) -> Boolean
 * - keyCode (Number): The keyCode to check if it is being pressed.
 *
 * Returns `true` if the key `keyCode` is currently being pressed down, or
 * `false` otherwise. `keyCode` can be any of the `Input.KEY_*` values,
 * or any other key code value for a input device with more keys (like a
 * full keyboard).
 **/
Input.prototype['isKeyDown'] = function(keyCode) {
    return this['_k'][keyCode] === true;
}

Input.prototype['toString'] = functionReturnString("[object Input]");

// Constants
/**
 * Input.MOUSE_PRIMARY -> ?
 *
 * Indicates that the primary mouse button has been clicked. This is
 * usually the left mouse button for right-handed people, and the right
 * mouse button for left-handed people.
 **/
Input['MOUSE_PRIMARY'] = 0;
/**
 * Input.MOUSE_MIDDLE -> ?
 *
 * Indicates that the middle button on the mouse has been clicked. Note
 * that not all mice have a middle button, so if you are planning on
 * using this functionality, it would be a good idea to make to action
 * be performed some other way as well (like a keystroke).
 **/
Input['MOUSE_MIDDLE'] = 1;
/**
 * Input.MOUSE_SECONDARY -> ?
 *
 * Indicates that the secondary mouse button has been clicked. This is
 * usually the right mouse button for right-handed people, and the left
 * mouse button for left-handed people.
 **/
Input['MOUSE_SECONDARY'] = 2;
/**
 * Input.KEY_DOWN -> ?
 *
 * Indicates that the `down` arrow or button is being pressed on the keypad.
 **/
Input['KEY_DOWN'] = 40;
/**
 * Input.KEY_UP -> ?
 *
 * Indicates that the `up` arrow or button is being pressed on the keypad.
 **/
Input['KEY_UP'] = 38;
/**
 * Input.KEY_LEFT -> ?
 *
 * Indicates that the `left` arrow or button is being pressed on the keypad.
 **/
Input['KEY_LEFT'] = 37;
/**
 * Input.KEY_RIGHT -> ?
 *
 * Indicates that the `right` arrow or button is being pressed on the keypad.
 **/
Input['KEY_RIGHT'] = 39;
/**
 * Input.KEY_1 -> ?
 *
 * Indicates that first button on the keypad is being pressed. The "first
 * button" can be configurable to say a client with a keyboard, but if
 * a controller is being used, this should also be the value returned.
 **/
Input['KEY_1'] = 32;
/**
 * Input.KEY_2 -> ?
 *
 * Indicates that second button on the keypad is being pressed.
 **/
Input['KEY_2'] = 33;
/**
 * Input.KEY_3 -> ?
 *
 * Indicates that third button on the keypad is being pressed.
 **/
Input['KEY_3'] = 34;
/**
 * Input.KEY_4 -> ?
 *
 * Indicates that fourth button on the keypad is being pressed.
 **/
Input['KEY_4'] = 35;

function blur() {
    currentInput = null;
}

function focus(input) {
    currentInput = input;
}

function getPointerCoords(event) {
    var offset = currentInput['game']['screen']['element']['cumulativeOffset']();
    return {
        'x': (event['pointerX']() - offset['left']),
        'y': (event['pointerY']() - offset['top'])
    };
}


function contextmenuHandler(event) {
    if (currentInput) {
        var eventObj = getPointerCoords(event), currentScreen = currentInput['game']['screen'];
        if (eventObj.x >= 0 && eventObj.y >= 0 &&
            eventObj.x <= currentScreen.width &&
            eventObj.y <= currentScreen.height) {
            event['stop']();
        }
    }
}

function keypressHandler(event) {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (currentInput) {
        event['stop']();
    }
}

function keydownHandler(event) {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (currentInput) {
        event['stop']();
        if (currentInput['_k'][event.keyCode] === true) return;
        var eventObj = {
                'keyCode': event.keyCode,
                'shiftKey': event.shiftKey
            };

        currentInput['_k'][event.keyCode] = true;

        currentInput['emit']("keydown", [eventObj]);
    }
}

function keyupHandler(event) {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (currentInput) {
        event['stop']();
        if (currentInput['_k'][event.keyCode] === false) return;
        var eventObj = {
                keyCode: event.keyCode,
                shiftKey: event.shiftKey
            };

        currentInput['_k'][event.keyCode] = false;

        currentInput['emit']("keyup", [eventObj]);
    }
}

function mousedownHandler(event) {
    if (currentInput) {
        var eventObj = getPointerCoords(event), currentScreen = currentInput['game']['screen'];
        eventObj['button'] = event['button'];
        if (eventObj.x >= 0 && eventObj.y >= 0 &&
            eventObj.x <= currentScreen.width &&
            eventObj.y <= currentScreen.height) {
            
            focus(currentInput);
            event['stop']();
            window.focus();

            //downMouseButtons[event.button] = true;

            currentInput['pointerX'] = eventObj.x;
            currentInput['pointerY'] = eventObj.y;

            currentInput['emit']("mousedown", [eventObj]);
        } else {
            blur();
            mousedownHandler(event);
        }
    } else {
        var i = runningGameInstances.length
        ,   offset = null
        ,   element = null
        ,   pointerX = event['pointerX']()
        ,   pointerY = event['pointerY']();
        while (i--) {
            element = runningGameInstances[i]['element'];
            offset = element['cumulativeOffset']();
            
            if (pointerX >= (offset['left'])
             && pointerX <= (offset['left'] + element['clientWidth'])
             && pointerY >= (offset['top'])
             && pointerY <= (offset['top'] + element['clientHeight'])) {
                 
                currentInput = runningGameInstances[i]['input'];
                mousedownHandler(event);
            }
        }
    }
}

function mouseupHandler(event) {
    if (currentInput) {
        var eventObj = getPointerCoords(event), currentScreen = currentInput['game']['screen'];
        eventObj['button'] = event['button'];
        if (eventObj.x >= 0 && eventObj.y >= 0 &&
            eventObj.x <= currentScreen.width &&
            eventObj.y <= currentScreen.height) {

            event['stop']();

            //downMouseButtons[event.button] = false;

            currentInput['pointerX'] = eventObj.x;
            currentInput['pointerY'] = eventObj.y;
            
            currentInput['emit']("mouseup", [eventObj]);
        }
    }
}

function mousemoveHandler(event) {
    if (currentInput) {
        var eventObj = getPointerCoords(event), currentScreen = currentInput['game']['screen'];
        if (eventObj.x >= 0 && eventObj.y >= 0 &&
            eventObj.x <= currentScreen.width &&
            eventObj.y <= currentScreen.height &&
            (currentInput['pointerX'] !== eventObj['x'] || currentInput['pointerY'] !== eventObj['y'])) {

            event['stop']();

            currentInput['pointerX'] = eventObj.x;
            currentInput['pointerY'] = eventObj.y;
            
            currentInput['emit']("mousemove", [eventObj]);
        }
    }
}

function touchstartHandler(event) {
    if (currentInput) {

        var currentScreen = currentInput['game']['screen'];
        for (var i=0, l=event['touches'].length; i<l; i++) {
        }
        
        /*if (eventObj.x >= 0 && eventObj.y >= 0 &&
            eventObj.x <= currentScreen.width &&
            eventObj.y <= currentScreen.height) {*/
            
            focus(currentInput);
            event['stop']();
            window.focus();

            //currentInput['pointerX'] = eventObj.x;
            //currentInput['pointerY'] = eventObj.y;

            currentInput['emit']("touchstart", [event]);
        /*} else {
            // Blur the current input
            blur();
            // Check for any other game instances' touches
            touchstartHandler(event);
        }*/

    } else {
        var i = runningGameInstances.length
        ,   game = null
        ,   element = null
        ,   offset = null
        ,   pointerX = null
        ,   pointerY = null;

        while (i--) {
            game = runningGameInstances[i];
            element = game['element'];
            offset = element['cumulativeOffset']();

            for (var j=0, l=event['changedTouches'].length; j<l; j++) {

                pointerX = event['changedTouches'][j]['pageX'];
                pointerY = event['changedTouches'][j]['pageY'];

                if (pointerX >= (offset['left'])
                    && pointerX <= (offset['left'] + game['screen']['width'])
                    && pointerY >= (offset['top'])
                    && pointerY <= (offset['top'] + game['screen']['height'])) {
                 
                    currentInput = game['input'];
                    touchstartHandler(event);
                }
            }
        }
    }
}

function touchmoveHandler(event) {
    if (currentInput) {
        event['stop']();

        currentInput['pointerX'] = event['touches'][0].x;
        currentInput['pointerY'] = event['touches'][0].y;
        
        currentInput['emit']("touchmove", [event]);
    }
}

function touchendHandler(event) {
    if (currentInput) {
        event['stop']();
    }
}

Input['grab'] = function() {
    document['observe']("keydown", keydownHandler)
            ['observe']("keypress", keypressHandler)
            ['observe']("keyup", keyupHandler)
            ['observe']("mousemove", mousemoveHandler)
            ['observe']("mousedown", mousedownHandler)
            ['observe']("mouseup", mouseupHandler)
            ['observe']("touchstart", touchstartHandler)
            ['observe']("touchmove", touchmoveHandler)
            ['observe']("touchend", touchendHandler)
            ['observe']("contextmenu", contextmenuHandler);
    Input.grabbed = true;
}

Input['release'] = function() {
    document['stopObserving']("keydown", keydownHandler)
            ['stopObserving']("keypress", keypressHandler)
            ['stopObserving']("keyup", keyupHandler)
            ['stopObserving']("mousemove", mousemoveHandler)
            ['stopObserving']("mousedown", mousedownHandler)
            ['stopObserving']("mouseup", mouseupHandler)
            ['stopObserving']("touchstart", touchstartHandler)
            ['stopObserving']("touchmove", touchmoveHandler)
            ['stopObserving']("touchend", touchendHandler)
            ['stopObserving']("contextmenu", contextmenuHandler);
    Input.grabbed = false;
}

modules['input'] = Input;