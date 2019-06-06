import { IOdooConnection } from "./connections/odooConnection";
import { OdooConnectionProtocol } from "./connections/odooConnectionProtocol";
import { OdooJsonRpcConnection } from "./connections/odooJsonRpcConnection";
import { OdooXmlRpcConnection } from "./connections/odooXmlRpcConnection";

export function createOdooConnection(
  hostname: string,
  port: number,
  db: string,
  username: string,
  password: string,
  protocol: OdooConnectionProtocol = OdooConnectionProtocol.JSON_RPC,
  secure: boolean = true
): IOdooConnection | null {
  if (protocol === OdooConnectionProtocol.JSON_RPC) {
    return new OdooJsonRpcConnection(
      hostname,
      port,
      db,
      username,
      password,
      secure
    );
  }

  if (protocol === OdooConnectionProtocol.XML_RPC) {
    return new OdooXmlRpcConnection(
      hostname,
      port,
      db,
      username,
      password,
      secure
    );
  }

  return null;
}
