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
}
