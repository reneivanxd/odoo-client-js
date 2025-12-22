import defaultHttpService, {
    IHeaders,
    IHttpService
} from "../services/http/httpService";
import { OdooConnection } from "./odooConnection";
import { OdooConnectionProtocol } from "./odooConnectionProtocol";

/**
 * Odoo XmlRpc Response Interface
 */
export interface IXmlRpcResult<T> {
    methodResponse: T;
}

/**
 * Odoo XmlRpc Connection implementation, see [[OdooConnection]].
 */
export class OdooXmlRpcConnection extends OdooConnection {
    /**
     * Odoo XmlRpc connection constructor
     *
     * @param baseUrl - Odoo server base url
     * @param db - Odoo database name
     * @param username - Odoo username
     * @param password - Odoo user password
     * @param httpService - Http service instance
     */
    constructor(
        baseUrl: string,
        db: string,
        username: string,
        password: string,
        httpService: IHttpService = defaultHttpService
    ) {
        super(
            baseUrl,
            db,
            username,
            password,
            OdooConnectionProtocol.XML_RPC,
            httpService
        );
    }

    /**
     * @inheritdoc
     */
    public async call<TResult>(
        service: string,
        method: string,
        ...args: any[]
    ): Promise<TResult> {
        const resp = await super.call<IXmlRpcResult<TResult>>(
            service,
            method,
            args
        );
        return resp.methodResponse;
    }

    /**
     * @inheritdoc
     */
    protected buildUrl(service: string): string {
        return `${super.buildUrl(service)}/${service}`;
    }

    /**
     * Builds a XmlRpc request body
     *
     * @param service - Odoo service name, eq. object
     * @param method - Odoo method name, eq. search
     * @returns - Json string
     * @throws - Not Implemented error
     */
    protected buildBody(
        service: string,
        method: string,
        ...args: any[]
    ): string {
        throw new Error("Not Implemented");
    }

    /**
     * Builds XmlRpc request headers.
     *
     * @returns - request headers, see [[IHeaders]]
     */
    protected buildHeaders(): IHeaders {
        return {
            "Content-Type": "text/xml; charset=utf-8"
        };
    }

    /**
     * Parses odoo XmlRpc api response
     *
     * @typeparam TResult - Body parse type
     * @param body - Response body
     * @returns - Parsed object
     * @throws - Not Implemented error
     */
    protected parseBody<TResult>(body: any): TResult {
        throw new Error("Not Implemented");
    }
}
