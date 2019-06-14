import { IOdooModel, OdooModel } from "../models/odooModel";
import { IHttpService } from "../services/http/httpService";
import { OdooCommonService } from "../services/odooCommonService";
import { OdooObjectService } from "../services/odooObjectService";
import { IOdooService, OdooService } from "../services/OdooService";
import { OdooServiceType } from "../services/odooServiceType";
import { OdooConnectionProtocol } from "./odooConnectionProtocol";

export interface IHeaders {
  [key: string]: string;
}

export interface IOdooConnection {
  hostname: string;
  port: number;
  db: string;
  username: string;
  password: string;
  protocol: OdooConnectionProtocol;
  secure: boolean;
  uid?: number;
  httpService: IHttpService;
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
  getModel: <TModel>(name: string) => IOdooModel<TModel>;
  call: <TResult>(
    service: string,
    method: string,
    ...args: any[]
  ) => Promise<TResult>;
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
  public httpService: IHttpService;

  constructor(
    hostname: string,
    port: number,
    db: string,
    username: string,
    password: string,
    protocol: OdooConnectionProtocol,
    secure: boolean,
    httpService: IHttpService
  ) {
    this.hostname = hostname;
    this.port = port;
    this.db = db;
    this.username = username;
    this.password = password;
    this.protocol = protocol;
    this.secure = secure;
    this.httpService = httpService;
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

  public getModel<TModel = any>(name: string): IOdooModel<TModel> {
    return new OdooModel(name, new OdooObjectService(this));
  }

  public async call<TResult>(
    service: string,
    method: string,
    ...args: any[]
  ): Promise<TResult> {
    const url = this.buildUrl(service);
    const headers = this.buildHeaders();
    const body = this.buildBody(service, method, ...args);
    const respBody = await this.httpService.post(url, body, headers);
    return this.parseBody<TResult>(respBody);
  }

  protected buildUrl(service: string): string {
    return `${this.secure ? "https" : "http"}://${this.hostname}:${this.port}/${
      this.protocol
    }`;
  }

  protected abstract buildBody(
    service: string,
    method: string,
    ...args: any[]
  ): string;

  protected abstract buildHeaders(): IHeaders;

  protected abstract parseBody<TResult>(body: any): TResult;
}
