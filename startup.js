var app = require('app');
app.init();
var screen = require('screen');
var util = require('util');

screen.clear();
var text = new Text(0, 0, window.w, Text.LINE_HEIGHT, 'Ringout Test');
window.add(text);


window.clearSoftkeys();

//set the first softkey to allow the user to place a call
window.setSoftkey(1, 'Test', function() {

    // extensino we're calling, either another line or a configured sound to play
    var number = 404;
    util.debug("calling number " + number);

    // While we're placing this call, make sure we do not exit when put into the
    // background. As soon as we're back in the foreground after placing the
    // call we will clear this state so we shutdown normally.
    digium.app.exitAfterBackground = false;

    digium.event.observe({
        'eventName': 'digium.app.foreground',
        'callback': function(params) {
            digium.event.stopObserving({'eventName' : 'digium.app.foregrond'});
            digium.app.exitAfterBackground = true;
        }
    });

    var callHandle = digium.phone.dial({
        'number': number,
        'handler': function (obj) {
            util.debug("obj");
            util.debug(JSON.stringify(obj));
            util.debug("state");
            util.debug(obj.state);

            /* This bit of code doesn't work or run, as I don't see the debugs above appear in the debug window */
            if ("CALLING" == obj.state) {
                digium.foreground();
            }
        }
    });
    util.debug("callHandle value: " + callHandle);
});

/*
So this block of code worked. I can observe an incoming call and then on the EARLY state, I can foreground the app.

 */
/*
digium.event.observe({
    'eventName': 'digium.phone.incoming_call',
    'callback': function(params) {
        util.debug(JSON.stringify(params));

        var msg = params.eventData;

        digium.phone.observeCallEvents({
            'callHandle': msg.callHandle,
            'handler': function(obj) {
                util.debug(obj.state);

                if (obj.state == "EARLY") {
                    digium.foreground();
                }
            }
        });

    }
});
*/
