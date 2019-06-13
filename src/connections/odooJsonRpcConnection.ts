import { OdooConnection } from "./odooConnection";
import { OdooConnectionProtocol } from "./odooConnectionProtocol";

export class OdooJsonRpcConnection extends OdooConnection {
  constructor(
    hostname: string,
    port: number,
    db: string,
    username: string,
    password: string,
    secure: boolean
  ) {
    super(
      hostname,
      port,
      db,
      username,
      password,
      OdooConnectionProtocol.JSON_RPC,
      secure
    );
  }

  protected buildBody(service: string, method: string, ...args: any[]): string {
    return JSON.stringify({
      id: Date.now(),
      jsonrpc: "2.0",
      method: "call",
      params: {
        service,
        method,
        args
      }
    });
  }
}
