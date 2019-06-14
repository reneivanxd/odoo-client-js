import { IHeaders, IHttpService } from "../services/http/httpService";
import { OdooConnection } from "./odooConnection";
import { OdooConnectionProtocol } from "./odooConnectionProtocol";

export interface IJsonRpcResult<T> {
  id: number;
  jsonrpc: string;
  result: T;
}

export class OdooJsonRpcConnection extends OdooConnection {
  constructor(
    baseUrl: string,
    db: string,
    username: string,
    password: string,
    httpService: IHttpService
  ) {
    super(
      baseUrl,
      db,
      username,
      password,
      OdooConnectionProtocol.JSON_RPC,
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
      ...args
    );
    return resp.result;
  }

  protected buildBody(service: string, method: string, ...args: any[]): string {
    return JSON.stringify({
      id: Date.now(),
      jsonrpc: "2.0",
      method: "call",
      params: {
        service,
        method,
        args: [...args]
      }
    });
  }

  protected buildHeaders(): IHeaders {
    return {
      "Content-Type": "application/json; charset=utf-8"
    };
  }

  protected parseBody<TResult>(body: any): TResult {
    return (typeof body === "string" ? JSON.parse(body) : body) as TResult;
  }
}
