import { IOdooConnection } from "../connections/odooConnection";
import { IOdooService, OdooService } from "./OdooService";

export interface IOdooCommonService extends IOdooService {
  version: () => any;
  authenticate: () => boolean;
  login: () => boolean;
}

export class OdooCommonService extends OdooService
  implements IOdooCommonService {
  constructor(connection: IOdooConnection) {
    super("common", connection);
  }

  public version(): any {
    return;
  }

  public authenticate(): boolean {
    return false;
  }

  public login(): boolean {
    return false;
  }
}
