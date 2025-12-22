import defaultHttpService, {
    IHeaders,
    IHttpService
} from "../services/http/httpService";
import { OdooConnection } from "./odooConnection";
import { OdooConnectionProtocol } from "./odooConnectionProtocol";

/**
 * Odoo JsonRpc Response Interface
 */
export interface IJsonRpcResult<T> {
    id: number;
    jsonrpc: string;
    result: T;
}

/**
 * Odoo JsonRpc Connection implementation, see [[OdooConnection]].
 */
export class OdooJsonRpcConnection extends OdooConnection {
    /**
     * Odoo JsonRpc connection constructor
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
            OdooConnectionProtocol.JSON_RPC,
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
        const resp = await super.call<IJsonRpcResult<TResult>>(
            service,
            method,
            ...args
        );
        return resp.result;
    }

    /**
     * Builds a JsonRpc request body
     *
     * @param service - Odoo service name, eq. object
     * @param method - Odoo method name, eq. search
     * @returns - Json string
     */
    protected buildBody(
        service: string,
        method: string,
        ...args: any[]
    ): string {
        return JSON.stringify({
            id: Date.now(),
            jsonrpc: "2.0",
            method: "call",
            params: {
                service,
                method,
                args: [...args]
            }
        });
    }

    /**
     * Builds JsonRpc request headers.
     *
     * @returns - request headers, see [[IHeaders]]
     */
    protected buildHeaders(): IHeaders {
        return {
            "Content-Type": "application/json; charset=utf-8"
        };
    }

    /**
     * Parses odoo JsonRpc api response
     *
     * @typeparam TResult - Body parse type
     * @param body - Response body
     * @returns - Parsed object
     */
    protected parseBody<TResult>(body: any): TResult {
        return (typeof body === "string" ? JSON.parse(body) : body) as TResult;
    }
}
