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
        execute(options: any) {
            var onSuccess = options.success;

            options.success = function (data, status, xhr) {
                if (onSuccess) {
                    var serverResponse = new ServerResponseFactory().create(this.jQuery, data, xhr);
                    onSuccess(serverResponse);
                }
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
        create(jQuery: any, data: any, xhr: XMLHttpRequest) {
            var response = new ServerResponse();
        
            response.title = xhr.getResponseHeader('X-Title') || '';
            response.flashes = [];
            response.data = data;

            var flashesJson = xhr.getResponseHeader('X-Flash-Messages');
            if (flashesJson) {
                response.flashes = jQuery.parseJSON(flashesJson);
            }
            
            return response;
        }
    }

    /**
     * Server response
     */         
    export class ServerResponse
    {
        title: string;
        flashes: FlashMessageInterface[];
        data: any;
    }

}
