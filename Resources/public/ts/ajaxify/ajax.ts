/// <reference path="message.ts"/>

/**
 * Imatic view ajaxify ajax module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.ajax {

    "use_strict";

    import FlashMessageInterface = imatic.view.ajaxify.message.FlashMessageInterface;

    /**
     * Ajax request
     * Represents an ajax request. Converts successful response into ServerResponse instance.
     */
    export class AjaxRequest
    {
        xhr: XMLHttpRequest;

        /**
         * Constructor
         */
        constructor(private jQuery: any) {}

        /**
         * Execute the request
         */
        execute(url: string, method: string, data: any, onComplete?: (response: ServerResponse) => void) {
            var options = {
                url: url,
                type: method,
                dataType: 'text',
                data: data,
                cache: false,
                complete: function (xhr: XMLHttpRequest, textStatus: string) {
                    if (onComplete) {
                        var serverResponse = new ServerResponseFactory().create(this.jQuery, xhr);
                        onComplete(serverResponse);
                    }
                },
            };

            this.xhr = this.jQuery.ajax(options);
        }
    }

    /**
     * Server response factory
     */
    class ServerResponseFactory
    {
        /**
         * Create server response
         */
        create(jQuery: any, xhr: XMLHttpRequest) {
            var response = new ServerResponse();

            response.flashes = [];
            response.data = xhr.responseText;
            response.valid = this.isValidStatus(xhr.status);
            response.successful = this.isSuccessfulStatus(xhr.status);

            var flashesJson = xhr.getResponseHeader('X-Flash-Messages');
            if (flashesJson) {
                response.flashes = jQuery.parseJSON(flashesJson);
            }

            return response;
        }

        /**
         * Determine valid state based on status
         */
        private isValidStatus(status: number): boolean {
            return
                status >= 200 && status < 300
                || 400 === status
            ;
        }

        /**
         * Determine success state based on status
         */
        private isSuccessfulStatus(status: number): boolean {
            return status >= 200 && status < 300;
        }
    }

    /**
     * Server response
     */
    export class ServerResponse
    {
        flashes: FlashMessageInterface[];
        data: any;
        successful: boolean;
        valid: boolean;
    }

}
