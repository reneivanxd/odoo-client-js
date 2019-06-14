import { IOdooConnection } from "../connections/odooConnection";
import { IOdooService, OdooService } from "./OdooService";

export interface IOdooObjectService extends IOdooService {
  execute_kw: <T = any>(...args: any[]) => Promise<T>;
}

export class OdooObjectService extends OdooService
  implements IOdooObjectService {
  constructor(connection: IOdooConnection) {
    super("object", connection);
  }

  public execute_kw<T = any>(...args: any[]): Promise<T> {
    return this.connection.call<T>(
      this.name,
      "execute_kw",
      this.connection.db,
      this.connection.uid,
      this.connection.password,
      ...args
    );
  }
}
