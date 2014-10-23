/// <reference path="message.ts"/>
/// <reference path="html.ts"/>
/// <reference path="jquery.ts"/>

/**
 * Imatic view ajaxify ajax module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.ajax {

    "use_strict";

    import jQuery                   = imatic.view.ajaxify.jquery.jQuery;

    import FlashMessageInterface    = imatic.view.ajaxify.message.FlashMessageInterface;
    import HtmlFragment             = imatic.view.ajaxify.html.HtmlFragment;

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
     * Request helper
     *
     * Provides helper methods related to requests.
     */
    export class RequestHelper
    {
        /**
         * Parse request string
         */
        static parseRequestString(requestString: string): RequestInfo {
            var requestInfo = new RequestInfo();

            if (typeof requestString !== 'string') {
                requestString = '';
            }

            // parse
            var method, url, contentSelector;
            var match = requestString.match(/^(?:([A-Z]+)\s)?(.*?)(?:;(.*))?$/);

            if (match) {
                method = match[1];
                url = match[2];
                contentSelector = match[3];
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

        private uid: number;
        private xhr: XMLHttpRequest;

        /**
         * Constructor
         */
        constructor(
            private url?: string,
            private method?: string,
            private data?: any,
            private dataType?: DataType,
            private contentSelector?: string
        ) {
            this.uid = ++Request.uidSequence;
            if (!this.dataType) {
                this.dataType = DataType.HTML;
            }
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
                throw new Error('Request not yet executed - XHR is not available');
            }

            return this.xhr;
        }

        /**
         * Get URL
         */
        getUrl(): string {
            return this.url || '';
        }

        /**
         * Set URL
         */
        setUrl(url: string): void {
            if (this.xhr) {
                throw new Error('Cannot change already executed request');
            }

            this.url = url;
        }

        /**
         * Get method
         */
        getMethod(): string {
            return this.method ? this.method.toUpperCase() : 'GET';
        }

        /**
         * Set method
         */
        setMethod(method: string): void {
            if (this.xhr) {
                throw new Error('Cannot change already executed request');
            }

            this.method = method;
        }

        /**
         * Get data
         */
        getData(): any {
            return this.data || {};
        }

        /**
         * Check if data are set
         */
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

        /**
         * Set data
         */
        setData(data: any): void {
            if (this.xhr) {
                throw new Error('Cannot change already executed request');
            }

            this.data = data;
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
         * Get content selector
         */
        getContentSelector(): any {
            return this.contentSelector || null;
        }

        /**
         * Set content selector
         */
        setContentSelector(contentSelector: string): void {
            if (this.xhr) {
                throw new Error('Cannot change already executed request');
            }

            this.contentSelector = contentSelector;
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
            requestInfo.contentSelector = this.getContentSelector();
            
            return requestInfo;
        }

        /**
         * Apply request info
         *
         * UID is not applied.
         */
        applyInfo(requestInfo: RequestInfo): void {
            this.url = requestInfo.url;
            this.method = requestInfo.method;
            this.data = requestInfo.data;
            this.contentSelector = requestInfo.contentSelector;
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
        contentSelector: string;
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
                    data = this.processHtmlData(xhr.responseText, request.getContentSelector());
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
            response.aborted = (0 === xhr.status && 'abort' === xhr.statusText);
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
