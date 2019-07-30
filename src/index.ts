import { IOdooConnection } from "./connections/odooConnection";
import { OdooConnectionProtocol } from "./connections/odooConnectionProtocol";
import { OdooJsonRpcConnection } from "./connections/odooJsonRpcConnection";
import { OdooXmlRpcConnection } from "./connections/odooXmlRpcConnection";
import { IHttpService } from "./services/http/httpService";

export function createOdooConnection(
    baseUrl: string,
    db: string,
    username: string,
    password: string,
    httpService: IHttpService,
    protocol: OdooConnectionProtocol = OdooConnectionProtocol.JSON_RPC
): IOdooConnection {
    if (protocol === OdooConnectionProtocol.JSON_RPC) {
        return new OdooJsonRpcConnection(
            baseUrl,
            db,
            username,
            password,
            httpService
        );
    }

    if (protocol === OdooConnectionProtocol.XML_RPC) {
        return new OdooXmlRpcConnection(
            baseUrl,
            db,
            username,
            password,
            httpService
        );
    }

    throw new Error(`Not Implemented protocol ${protocol}`);
}

export * from "./connections/odooConnection";
export * from "./connections/odooConnectionProtocol";
export * from "./connections/odooJsonRpcConnection";
export * from "./connections/odooXmlRpcConnection";
export * from "./services/http/httpService";
export * from "./models/odooModel";
export * from "./models/odooModelDomain";
export * from "./models/queryBuilder";
