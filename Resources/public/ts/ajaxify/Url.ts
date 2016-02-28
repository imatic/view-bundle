/**
 * URL
 */
export class Url
{
    public protocol: string;
    public host: string;
    public port: string;
    public path: string;
    public query: string;
    public hash: string;

    private static parser: HTMLAnchorElement;

    constructor(url: string) {
        if (!Url.parser) {
            Url.parser = <HTMLAnchorElement> document.createElement('a');
        }

        Url.parser.href = url;

        // make sure all properties are correct
        // (href is always fully resolved, but properties may not be in some browsers)
        Url.parser.href = Url.parser.href;

        this.protocol = Url.parser.protocol;
        this.host = Url.parser.hostname;
        this.port = Url.parser.port;
        this.path = Url.parser.pathname;
        this.query = Url.parser.search;
        this.hash = Url.parser.hash;

        if ('/' !== this.path.charAt(0)) {
            this.path = '/' + this.path;
        }
    }

    isHttp(): boolean {
        return 'http:' === this.protocol || 'https:' === this.protocol;
    }

    isLocal(): boolean {
        return document.domain === this.host;
    }
}
