import { IOdooConnection } from "../connections/odooConnection";

export interface IOdooService {
  name: string;
  connection: IOdooConnection;
  call: (method: string) => any;
}

export class OdooService implements IOdooService {
  public name: string;
  public connection: IOdooConnection;

  constructor(name: string, connection: IOdooConnection) {
    this.name = name;
    this.connection = connection;
  }

  public call(method: string): any {
    return null;
  }
}
