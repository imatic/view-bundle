/**
 * Exception
 */
export class Exception implements Error
{
    name: string;

    constructor(public message: string) {}

    /**
     * Get string representation of the exception
     */
    toString(): string {
        return this.message;
    }
}
