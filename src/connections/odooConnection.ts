import { IOdooModel, OdooModel } from "../models/odooModel";
import { OdooCommonService } from "../services/odooCommonService";
import { OdooObjectService } from "../services/odooObjectService";
import { IOdooService, OdooService } from "../services/OdooService";
import { OdooServiceType } from "../services/odooServiceType";
import { OdooConnectionProtocol } from "./odooConnectionProtocol";

export interface IOdooConnection {
  hostname: string;
  port: number;
  db: string;
  username: string;
  password: string;
  protocol: OdooConnectionProtocol;
  secure: boolean;
  uid?: number;
  baseUrl: string;
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
  public secure: boolean;
  public uid?: number;
  public baseUrl: string;

  constructor(
    hostname: string,
    port: number,
    db: string,
    username: string,
    password: string,
    protocol: OdooConnectionProtocol,
    secure: boolean
  ) {
    this.hostname = hostname;
    this.port = port;
    this.db = db;
    this.username = username;
    this.password = password;
    this.protocol = protocol;
    this.secure = secure;
    this.baseUrl = this.buildBaseUrl();
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

  public getModel(name: string): IOdooModel {
    return new OdooModel(name, new OdooObjectService(this));
  }

  protected buildBaseUrl(): string {
    return `${this.secure ? "https" : "http"}://${this.hostname}:${this.port}/${
      this.protocol
    }`;
  }
}
