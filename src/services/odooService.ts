import { IOdooConnection } from "../connections/odooConnection";

export interface IOdooService {
  name: string;
  connection: IOdooConnection;
  call: <T>(method: string, ...args: any[]) => Promise<T>;
}

export class OdooService implements IOdooService {
  public name: string;
  public connection: IOdooConnection;

  constructor(name: string, connection: IOdooConnection) {
    this.name = name;
    this.connection = connection;
  }

  public call<T = any>(method: string, ...args: any[]): Promise<T> {
    return this.connection.call(this.name, method);
  }
}
