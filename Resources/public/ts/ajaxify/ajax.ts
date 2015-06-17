/// <reference path="Message.ts"/>
/// <reference path="Html.ts"/>
/// <reference path="Jquery.ts"/>

/**
 * Imatic view ajaxify ajax module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module Imatic.View.Ajaxify.Ajax {

    "use_strict";

    import jQuery                   = Imatic.View.Ajaxify.Jquery.jQuery;
    import FlashMessageInterface    = Imatic.View.Ajaxify.Message.FlashMessageInterface;
    import HtmlFragment             = Imatic.View.Ajaxify.Html.HtmlFragment;

    /**
     * Data types
     */
    export enum DataType
    {
        TEXT,
        HTML,
        JSON
    }

    /**
     * Request info
     *
     * Holds information about a request.
     */
    export class RequestInfo
    {
        public uid: number = null;

        constructor(
            public url: string = '',
            public method: string = 'GET',
            public data: any = null,
            public contentSelector: string = null,
            public headers: {[key: string]: any} = null
        ) {
            if (null === this.headers) {
                this.headers = {};
            }
        }

        hasData(): boolean {
            if (
                this.data
                && (
                    'string' === typeof this.data
                    || !jQuery.isEmptyObject(this.data)
                )
            ) {
                return true;
            } else {
                return false;
            }
        }
    }

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
        parseRequestString(requestString: string): RequestInfo {
            var requestInfo = new RequestInfo();

            if (typeof requestString !== 'string') {
                requestString = '';
            }

            // parse
            var method, url, contentSelector;
            var match = requestString.match(/^(?:([A-Z]+)\s)?(.*?)(?:;(.*))?$/);

            if (match) {
                method = match[1];
                url = jQuery.trim(match[2]);
                contentSelector = jQuery.trim(match[3]);
            }

            if ('@page' === url) {
                url = '';
            }

            // populate instance
            requestInfo.uid = null;
            requestInfo.url = url || '';
            requestInfo.method = method || 'GET';
            requestInfo.data = null;
            requestInfo.contentSelector = contentSelector || null;

            return requestInfo;
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

        private xhr: XMLHttpRequest;

        constructor(
            private info: RequestInfo,
            private dataType?: DataType
        ) {
            info.uid = ++Request.uidSequence;

            if (!this.dataType) {
                this.dataType = DataType.HTML;
            }
        }

        /**
         * Get request info
         */
        getInfo(): RequestInfo {
            return this.info;
        }

        /**
         * Set request info
         */
        setInfo(info: RequestInfo): void {
            this.info = info;
        }

        /**
         * Get data type
         */
        getDataType(): DataType {
            return this.dataType;
        }

        /**
         * Set data type
         */
        setDataType(dataType: DataType): void {
            if (this.xhr) {
                throw new Error('Cannot change already executed request');
            }

            this.dataType = dataType;
        }

        /**
         * Get XHR instance
         *
         * Can only be obtained after the request has been executed.
         */
        getXhr(): XMLHttpRequest {
            if (!this.xhr) {
                throw new Error('Request not yet executed - XHR is not available');
            }

            return this.xhr;
        }

        /**
         * Perform the request
         */
        execute(): jQuery.Promise {
            var deferred = jQuery.Deferred();
            var url = this.info.url || '';
            var method = (this.info.method || 'GET').toUpperCase();
            var data = this.info.data || {};
            var headers = this.info.headers || {};

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
                headers: headers,
                cache: false,
                complete: (): void => {
                    var response = new ResponseFactory().create(this);

                    if (response.successful) {
                        deferred.resolve(response);
                    } else {
                        deferred.reject(response);
                    }
                }
            };

            // execute request
            this.xhr = jQuery.ajax(options);

            return deferred.promise();
        }
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
            var data;
            var flashes = [];

            // process data according to it's expected type
            switch (request.getDataType()) {
                case DataType.TEXT:
                    data = xhr.responseText;
                    break;
                case DataType.HTML:
                    data = this.processHtmlData(xhr.responseText, request.getInfo().contentSelector);
                    break;
                case DataType.JSON:
                    if (xhr.responseText) {
                        data = jQuery.parseJSON(xhr.responseText);
                    } else {
                        data = null;
                    }
                    break;
                default:
                    throw new Error('Invalid data type');
            }

            // parse flash messages
            var flashesJson = xhr.getResponseHeader('X-Flash-Messages');
            if (flashesJson) {
                flashes = <FlashMessageInterface[]> jQuery.parseJSON(flashesJson);
            }

            // parse title
            var title, fullTitle;
            var titleJson = xhr.getResponseHeader('X-Title');
            if (titleJson) {
                var titles = jQuery.parseJSON(titleJson);
                title = titles['title'];
                fullTitle = titles['fullTitle'];
            }

            // populate the response object
            response.title = title || '';
            response.fullTitle = fullTitle || '';
            response.data = data;
            response.dataType = request.getDataType();
            response.valid = this.isValidStatus(xhr.status);
            response.successful = this.isSuccessfulStatus(xhr.status);
            response.aborted = (0 === xhr.status || 'abort' === xhr.statusText);
            response.request = request.getInfo();
            response.flashes = flashes;

            return response;
        }

        /**
         * Process HTML data
         */
        private processHtmlData(html: string, contentSelector: string): JQuery {
            var result;
            var fragment = new HtmlFragment(html);

            if (contentSelector && fragment.contains(contentSelector)) {
                result = fragment.find(contentSelector);
            }

            if (!result) {
                result = fragment.root();
            }

            return result;
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
        dataType: DataType;
        successful: boolean;
        valid: boolean;
        aborted: boolean;
        request: RequestInfo;
    }

}
