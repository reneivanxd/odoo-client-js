import { IOdooConnection } from "./connections/odooConnection";
import { OdooConnectionProtocol } from "./connections/odooConnectionProtocol";
import { OdooJsonRpcConnection } from "./connections/odooJsonRpcConnection";
import { OdooXmlRpcConnection } from "./connections/odooXmlRpcConnection";
import { IHttpService } from "./services/http/httpService";

export function createOdooConnection(
  hostname: string,
  port: number,
  db: string,
  username: string,
  password: string,
  protocol: OdooConnectionProtocol = OdooConnectionProtocol.JSON_RPC,
  secure: boolean = true,
  httpService: IHttpService
): IOdooConnection | null {
  if (protocol === OdooConnectionProtocol.JSON_RPC) {
    return new OdooJsonRpcConnection(
      hostname,
      port,
      db,
      username,
      password,
      secure,
      httpService
    );
  }

  if (protocol === OdooConnectionProtocol.XML_RPC) {
    return new OdooXmlRpcConnection(
      hostname,
      port,
      db,
      username,
      password,
      secure,
      httpService
    );
  }

  return null;
}
