/**
 * Imatic view ajaxify exception module
 *
 * @author Pavel Batecko <pavel.batecko@imatic.cz>
 */
module imatic.view.ajaxify.exception {

    "use_strict";

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

}
