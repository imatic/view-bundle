/**
 * Handle onclick event
 */
function onClick(event: JQueryEventObject): void {
    var element = <HTMLElement> event.target;

    var toggle = jQuery(element).data('toggle');
    
    if (toggle) {
        var target = jQuery(toggle);

        if (target.length > 0) {
            if (target.is(':animated')) {
                target.stop(true, true);
            }

            target.slideToggle();
            event.preventDefault();
        }
    }
}

// listen to click events
$(document).on('click', onClick);
