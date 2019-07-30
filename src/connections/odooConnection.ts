import { IOdooModel, OdooModel } from "../models/odooModel";
import { IHeaders, IHttpService } from "../services/http/httpService";
import { OdooConnectionProtocol } from "./odooConnectionProtocol";

export interface IOdooVersion {
    server_version: string;
    server_serie: string;
    protocol_version: number;
    server_version_info: any[];
}

export interface IUserContext {
    tz: string;
    lang: string;
}

export interface IAuthResponse {
    userId: number;
    userContext: IUserContext;
}

export interface IOdooConnection {
    baseUrl: string;
    db: string;
    username: string;
    password: string;
    protocol: OdooConnectionProtocol;
    uid?: number;
    userContext?: IUserContext;
    httpService: IHttpService;
    version: () => Promise<IOdooVersion>;
    authenticate: () => Promise<IAuthResponse>;
    getModel: <TModel>(name: string) => IOdooModel<TModel>;
    call: <TResult>(
        service: string,
        method: string,
        ...args: any[]
    ) => Promise<TResult>;
    execute_kw: <TResult>(service: string, ...args: any[]) => Promise<TResult>;
}

export abstract class OdooConnection implements IOdooConnection {
    public baseUrl: string;
    public db: string;
    public username: string;
    public password: string;
    public protocol: OdooConnectionProtocol;
    public uid?: number;
    public userContext?: IUserContext;
    public httpService: IHttpService;

    constructor(
        baseUrl: string,
        db: string,
        username: string,
        password: string,
        protocol: OdooConnectionProtocol,
        httpService: IHttpService
    ) {
        this.baseUrl = baseUrl;
        this.db = db;
        this.username = username;
        this.password = password;
        this.protocol = protocol;
        this.httpService = httpService;
    }

    public getModel<TModel = any>(name: string): IOdooModel<TModel> {
        return new OdooModel<TModel>(name, this);
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

    public async execute_kw<TResult>(
        service: string,
        ...args: any[]
    ): Promise<TResult> {
        if (!this.uid) {
            await this.authenticate();
        }

        return this.call<TResult>(
            service,
            "execute_kw",
            this.db,
            this.uid,
            this.password,
            ...args
        );
    }

    public async authenticate(): Promise<IAuthResponse> {
        this.uid = await this.call<number>(
            "common",
            "authenticate",
            this.db,
            this.username,
            this.password,
            []
        );

        this.userContext = await this.execute_kw<IUserContext>(
            "object",
            "res.users",
            "context_get",
            []
        );

        return { userId: this.uid, userContext: this.userContext };
    }

    public version(): Promise<IOdooVersion> {
        return this.call<IOdooVersion>("common", "version");
    }

    protected buildUrl(service: string): string {
        return `${this.baseUrl}${this.baseUrl.endsWith("/") ? "" : "/"}${
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
