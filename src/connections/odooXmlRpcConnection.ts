import { IHttpService } from "../services/http/httpService";
import { IHeaders, OdooConnection } from "./odooConnection";
import { OdooConnectionProtocol } from "./odooConnectionProtocol";

export interface IXmlRpcResult<T> {
  methodResponse: T;
}

export class OdooXmlRpcConnection extends OdooConnection {
  constructor(
    hostname: string,
    port: number,
    db: string,
    username: string,
    password: string,
    secure: boolean,
    httpService: IHttpService
  ) {
    super(
      hostname,
      port,
      db,
      username,
      password,
      OdooConnectionProtocol.XML_RPC,
      secure,
      httpService
    );
  }

  public async call<TResult>(
    service: string,
    method: string,
    ...args: any[]
  ): Promise<TResult> {
    const resp = await super.call<IXmlRpcResult<TResult>>(
      service,
      method,
      args
    );
    return resp.methodResponse;
  }

  protected buildUrl(service: string): string {
    return `${super.buildUrl(service)}/${service}`;
  }

  protected buildBody(service: string, method: string, ...args: any[]): string {
    return "";
  }

  protected buildHeaders(): IHeaders {
    return {
      "Content-Type": "text/xml; charset=utf-8"
    };
  }

  protected parseBody<TResult>(body: string): TResult {
    return {} as TResult;
  }
}
