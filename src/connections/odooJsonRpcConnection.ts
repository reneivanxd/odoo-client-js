import { IHttpService } from "../services/http/httpService";
import { IHeaders, OdooConnection } from "./odooConnection";
import { OdooConnectionProtocol } from "./odooConnectionProtocol";

export interface IJsonRpcResult<T> {
  id: number;
  jsonrpc: string;
  result: T;
}

export class OdooJsonRpcConnection extends OdooConnection {
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
      OdooConnectionProtocol.JSON_RPC,
      secure,
      httpService
    );
  }

  public async call<TResult>(
    service: string,
    method: string,
    ...args: any[]
  ): Promise<TResult> {
    const resp = await super.call<IJsonRpcResult<TResult>>(
      service,
      method,
      args
    );
    return resp.result;
  }

  protected buildBody(service: string, method: string, ...args: any[]): string {
    return JSON.stringify({
      id: Date.now(),
      jsonrpc: "2.0",
      params: {
        service,
        method,
        args
      }
    });
  }

  protected buildHeaders(): IHeaders {
    return {
      "Content-Type": "application/json; charset=utf-8"
    };
  }

  protected parseBody<TResult>(body: string): TResult {
    return JSON.parse(body) as TResult;
  }
}
