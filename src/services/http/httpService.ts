/**
 * Basic interface to represent the request header map
 */
export interface IHeaders {
    [key: string]: string;
}

/**
 * Interface to declare an http service, making odoo connection independent of the http service or library used.
 */
export interface IHttpService {
    /**
     * Function that [[OdooConnection]] is going to call in order to connect with Odoo server
     *
     * Must be a HTTP POST request.
     *
     * @param url - Odoo sever url
     * @param data - Request body
     * @param headers - Request headers
     * @returns - A Promise of a string or object
     */
    post(url: string, data: any, headers: IHeaders): Promise<any>;
}
