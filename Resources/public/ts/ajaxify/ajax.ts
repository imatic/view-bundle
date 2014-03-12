/// <reference path="message.ts"/>
/// <reference path="jquery.ts"/>

/**
 * Imatic view ajaxify ajax module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.ajax {

    "use_strict";

    import FlashMessageInterface    = imatic.view.ajaxify.message.FlashMessageInterface;
    import jQuery                   = imatic.view.ajaxify.jquery.jQuery;

    /**
     * Request helper
     *
     * Provides helper methods related to requests.
     */
    export class RequestHelper
    {
        /**
         * Parse request string
         */
        static parseRequestString(requestString: string): {
            url: string;
            method: string;
            data: any;
            contentSelector: string;
        } {
            var parts;

            if (typeof requestString === 'string') {
                parts = requestString.split(';', 3);
            } else {
                parts = [];
            }

            return {
                url: parts[0] || '',
                method: parts[1] || 'GET',
                data: null,
                contentSelector: parts[2] || null,
            };
        }
    }

    /**
     * Request
     *
     * Represents an request. Converts successful response into a Response instance.
     */
    export class Request
    {
        static uidSequence: number = 0;

        private uid: number;
        private xhr: XMLHttpRequest;

        /**
         * Constructor
         */
        constructor(
            private url?: string,
            private method?: string,
            private data?: any
        ) {
            this.uid = ++Request.uidSequence;
        }

        /**
         * Get unique request UID
         */
        getUid(): number {
            return this.uid;
        }

        /**
         * Get XHR instance
         *
         * Can only be obtained after the request has been executed.
         */
        getXhr(): XMLHttpRequest {
            if (!this.xhr) {
                throw new Error('Request not executed - XHR is not available');
            }

            return this.xhr;
        }

        /**
         * Get request URL
         */
        getUrl(): string {
            return this.url || '';
        }

        /**
         * Get request method
         */
        getMethod(): string {
            return this.method ? this.method.toUpperCase() : 'GET';
        }

        /**
         * Get request data
         */
        getData(): any {
            return this.data || {};
        }

        /**
         * Get request info
         */
        getInfo(): RequestInfo {
            var requestInfo = new RequestInfo();

            requestInfo.uid = this.getUid();
            requestInfo.url = this.getUrl();
            requestInfo.method = this.getMethod();
            requestInfo.data = this.getData();
            
            return requestInfo;
        }

        /**
         * Execute the request
         */
        execute(onComplete?: (response: Response) => void) {
            var url = this.url || '';
            var method = (this.method || 'GET').toUpperCase();
            var data = this.data || {};

            // convert methods other than GET and POST into POST + _method
            if ('GET' !== method && 'POST' !== method) {
                if ('object' === typeof data) {
                    data['_method'] = method;
                } else if ('string' === typeof data) {
                    data += (data.length > 0 ? '&' : '') + '_method=' + method;
                }

                method = 'POST';
            }

            // prepare options
            var options = {
                url: url,
                type: method,
                dataType: 'text',
                data: data,
                cache: false,
                complete: (xhr: XMLHttpRequest, textStatus: string): void => {
                    if (onComplete) {
                        var response = new ResponseFactory().create(this);
                        onComplete(response);
                    }
                },
            };

            // execute request
            this.xhr = jQuery.ajax(options);
        }
    }

    /**
     * Request info
     *
     * Holds information about a request.
     */
    export class RequestInfo
    {
        uid: number;
        url: string;
        method: string;
        data: any;
    }

    /**
     * Response factory
     */
    class ResponseFactory
    {
        /**
         * Create response from executed request
         */
        create(request: Request): Response {
            var response = new Response();
            var xhr = request.getXhr();

            response.title = xhr.getResponseHeader('X-Title') || '';
            response.fullTitle = xhr.getResponseHeader('X-Full-Title') || '';
            response.flashes = [];
            response.data = xhr.responseText;
            response.valid = this.isValidStatus(xhr.status);
            response.successful = this.isSuccessfulStatus(xhr.status);
            response.aborted = (0 === xhr.status && 'abort' === xhr.statusText);
            response.request = request.getInfo();

            var flashesJson = xhr.getResponseHeader('X-Flash-Messages');
            if (flashesJson) {
                response.flashes = <FlashMessageInterface[]> jQuery.parseJSON(flashesJson);
            }

            return response;
        }

        /**
         * Determine valid state based on status
         */
        private isValidStatus(status: number): boolean {
            return status >= 200 && status < 300 || 400 === status;
        }

        /**
         * Determine success state based on status
         */
        private isSuccessfulStatus(status: number): boolean {
            return status >= 200 && status < 300;
        }
    }

    /**
     * Response
     *
     * Holds results of a request.
     */
    export class Response
    {
        title: string;
        fullTitle: string;
        flashes: FlashMessageInterface[];
        data: any;
        successful: boolean;
        valid: boolean;
        aborted: boolean;
        request: RequestInfo;
    }

}
