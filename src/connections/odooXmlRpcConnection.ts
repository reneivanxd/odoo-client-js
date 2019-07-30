import { IHeaders, IHttpService } from "../services/http/httpService";
import { OdooConnection } from "./odooConnection";
import { OdooConnectionProtocol } from "./odooConnectionProtocol";

export interface IXmlRpcResult<T> {
    methodResponse: T;
}

export class OdooXmlRpcConnection extends OdooConnection {
    constructor(
        baseUrl: string,
        db: string,
        username: string,
        password: string,
        httpService: IHttpService
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

    protected buildUrl(service: string): string {
        return `${super.buildUrl(service)}/${service}`;
    }

    protected buildBody(
        service: string,
        method: string,
        ...args: any[]
    ): string {
        throw new Error("Not Implemented");
    }

    protected buildHeaders(): IHeaders {
        return {
            "Content-Type": "text/xml; charset=utf-8"
        };
    }

    protected parseBody<TResult>(body: any): TResult {
        throw new Error("Not Implemented");
    }
}
