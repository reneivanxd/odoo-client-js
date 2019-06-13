import { OdooConnection } from "./odooConnection";
import { OdooConnectionProtocol } from "./odooConnectionProtocol";

export class OdooXmlRpcConnection extends OdooConnection {
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
      OdooConnectionProtocol.XML_RPC,
      secure
    );
  }

  protected buildBody(service: string, method: string, ...args: any[]): string {
    return "";
  }
}
