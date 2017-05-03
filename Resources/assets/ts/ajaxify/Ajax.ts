import * as Ajaxify from './Ajaxify';
import {FlashMessageInterface} from './FlashMessage';
import {HtmlFragment} from './Html';

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
 * Exception info
 */
interface ExceptionInfoInterface
{
    className: string;
    message: string;
    file: string;
    line: number;
    trace: string;
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

    /**
     * Append a key-value pair to the data
     */
    appendData(key: string, value: any): void {
        this.data = Ajaxify.requestHelper.appendData(this.data, key, value);
    }

    /**
     * See if any data has been set
     */
    hasData(): boolean {
        if (
            this.data
            && (
                'string' === typeof this.data
                || !$.isEmptyObject(this.data)
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
        var match = requestString.match(/^^(?:([A-Z]+)\s)?([^;]*)(?:;(.*))?$/);

        if (match) {
            method = match[1];
            url = $.trim(match[2]);
            contentSelector = $.trim(match[3]);
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

    /**
     * Append a key-value pair to the given data
     */
    appendData(data: any, key: string, value: any): any {
        if (data && ('string' === typeof data || !$.isEmptyObject(data))) {
            if ('string' === typeof data) {
                // string
                data += '&' + key + '=' + encodeURIComponent(value);
            } else if ('FormData' in window && data instanceof FormData) {
                // form data
                data.append(key, value);
            } else if ($.isArray(data)) {
                // array
                data.push({name: key, value: value});
            } else {
                // key-value map
                data[key] = value;
            }
        } else {
            // create a plain object
            data = {};
            data[key] = value;
        }

        return data;
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
    execute(): JQueryPromise<any> {
        var deferred = $.Deferred();
        var url = this.info.url || '';
        var method = (this.info.method || 'GET').toUpperCase();
        var data = this.info.data || {};
        var headers = this.info.headers || {};            

        // convert methods other than GET and POST into POST + _method parameter
        if ('GET' !== method && 'POST' !== method) {
            data = Ajaxify.requestHelper.appendData(data, '_method', method);
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

        if ('FormData' in window && data instanceof FormData) {
            options['processData'] = false;
            options['contentType'] = false;
        }

        // execute request
        this.xhr = $.ajax(options);

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

        // process data according to its expected type
        switch (request.getDataType()) {
            case DataType.TEXT:
                data = xhr.responseText;
                break;
            case DataType.HTML:
                data = this.parseHtml(xhr.responseText, request.getInfo().contentSelector);
                break;
            case DataType.JSON:
                if (xhr.responseText) {
                    data = $.parseJSON(xhr.responseText);
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
            flashes = <FlashMessageInterface[]> $.parseJSON(flashesJson);
        }

        // parse title
        var title, fullTitle;
        var titleJson = xhr.getResponseHeader('X-Title');
        if (titleJson) {
            var titles = $.parseJSON(titleJson);
            title = titles['title'];
            fullTitle = titles['fullTitle'];
        }

        // parse exception info
        var exception;
        var exceptionJson = xhr.getResponseHeader('X-Debug-Exception');
        if (exceptionJson) {
            exception = $.parseJSON(exceptionJson);
        }

        // populate the response object
        response.title = title || '';
        response.fullTitle = fullTitle || '';
        response.data = data;
        response.dataType = request.getDataType();
        response.valid = this.isValidStatus(xhr.status);
        response.successful = this.isSuccessfulStatus(xhr.status);
        response.code = xhr.status;
        response.aborted = (0 === xhr.status || 'abort' === xhr.statusText);
        response.request = request.getInfo();
        response.flashes = flashes;
        response.exception = exception;

        return response;
    }

    /**
     * Process HTML response
     */
    private parseHtml(html: string, contentSelector: string): JQuery {
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
    exception: ExceptionInfoInterface;
    data: any;
    dataType: DataType;
    successful: boolean;
    code: number;
    valid: boolean;
    aborted: boolean;
    request: RequestInfo;
}
