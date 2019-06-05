import { IOdooConnection } from "../connections/odooConnection";
import { IOdooService, OdooService } from "./OdooService";

export interface IOdooObjectService extends IOdooService {
  execute_kw: () => void;
}

export class OdooObjectService extends OdooService
  implements IOdooObjectService {
  constructor(connection: IOdooConnection) {
    super("object", connection);
  }

  public execute_kw(): void {
    return;
  }
}
