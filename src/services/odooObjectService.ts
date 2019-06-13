import { IOdooConnection } from "../connections/odooConnection";
import { IOdooService, OdooService } from "./OdooService";

export interface IOdooObjectService extends IOdooService {
  execute_kw: <T = any>(...args: any[]) => T;
}

export class OdooObjectService extends OdooService
  implements IOdooObjectService {
  constructor(connection: IOdooConnection) {
    super("object", connection);
  }

  public execute_kw<T = any>(...args: any[]): T {
    return {} as T;
  }
}
