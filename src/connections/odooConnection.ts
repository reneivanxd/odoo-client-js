import { OdooCommonService } from "../services/odooCommonService";
import { OdooObjectService } from "../services/odooObjectService";
import { IOdooService, OdooService } from "../services/OdooService";
import { OdooServiceType } from "../services/odooServiceType";

export enum OdooConnectionProtocol {
  JSON_RPC,
  XML_RPC
}

export interface IOdooConnection {
  hostname: string;
  port: number;
  db: string;
  username: string;
  password: string;
  protocol: OdooConnectionProtocol;
  uid?: number;
  // version: () => Promise<any>;
  // authenticate: () => Promise<boolean>;
  // login: () => Promise<boolean>;
  // search: () => Promise<any>;
  // read: () => Promise<any>;
  // search_read: () => Promise<any>;
  // create: (data: any) => Promise<any>;
  // write: (data: any) => Promise<any>;
  getServiceByName: (name: string) => IOdooService;
  getService: (type: OdooServiceType) => IOdooService;
  getModel: (name: string) => any;
}

export abstract class OdooConnection implements IOdooConnection {
  public hostname: string;
  public port: number;
  public db: string;
  public username: string;
  public password: string;
  public protocol: OdooConnectionProtocol;
  public uid?: number;

  constructor(
    hostname: string,
    port: number,
    db: string,
    username: string,
    password: string,
    protocol: OdooConnectionProtocol
  ) {
    this.hostname = hostname;
    this.port = port;
    this.db = db;
    this.username = username;
    this.password = password;
    this.protocol = protocol;
  }

  public getService(type: OdooServiceType): IOdooService {
    if (type === OdooServiceType.OBJECT) {
      return new OdooObjectService(this);
    }

    if (type === OdooServiceType.COMMON) {
      return new OdooCommonService(this);
    }

    return this.getServiceByName(type);
  }

  public getServiceByName(name: string): IOdooService {
    return new OdooService(name, this);
  }

  public getModel(name: string): any {
    return null;
  }
}
