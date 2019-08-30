import {
    IAuthResponse,
    IOdooVersion,
    IUserContext
} from "../models/auth/authModel";
import { IOdooModel, OdooModel } from "../models/odooModel";
import { IHeaders, IHttpService } from "../services/http/httpService";
import { OdooConnectionProtocol } from "./odooConnectionProtocol";

/**
 * Odoo connection interface
 */
export interface IOdooConnection {
    /**
     * Get Odoo server version information, see [[IOdooVersion]]
     *
     * @returns - A Promise.
     */
    version(): Promise<IOdooVersion>;
    /**
     * Authenticate odoo user
     *
     * @returns - A Promise.
     */
    authenticate(): Promise<IAuthResponse>;
    /**
     * Get a Odoo model instance, see [[OdooModel]]
     *
     * @typeparam TModel - Model custom type
     * @param name - Odoo model name, eq. sale.order
     * @returns - new [[OdooModel]] instance.
     */
    getModel<TModel>(name: string): IOdooModel<TModel>;
    /**
     * Call Odoo server
     *
     * @typeparam TResult - Result map model
     * @param service - Odoo service name, eq. object
     * @param method  - Odoo method name, eq. search
     * @param args - Odoo method arguments
     * @returns - A Promise.
     */
    call<TResult>(
        service: string,
        method: string,
        ...args: any[]
    ): Promise<TResult>;
    /**
     * Call odoo server, but first injects authentication arguments. see [[call]]
     *
     * @typeparam TResult - Result map model
     * @param service - Odoo service name, eq. object
     * @param args - Odoo method arguments
     * @returns - A Promise.
     */
    execute_kw<TResult>(service: string, ...args: any[]): Promise<TResult>;
}

/**
 * Base odoo connection implementation, see [[IOdooConnection]]
 */
export abstract class OdooConnection implements IOdooConnection {
    /**
     * Odoo server base url
     */
    protected baseUrl: string;
    /**
     * Odoo database name
     */
    protected db: string;
    /**
     * Odoo username
     */
    protected username: string;
    /**
     * Odoo user password
     */
    protected password: string;
    /**
     * Odoo connection protocol, see [[OdooConnectionProtocol]]
     */
    protected protocol: OdooConnectionProtocol;
    /**
     * Odoo user identifier, set after authentication
     */
    protected uid?: number;
    /**
     * Odoo user context, set after authentication, see [[IUserContext]]
     */
    protected userContext?: IUserContext;
    /**
     * Http service instance, see [[IHttpService]]
     */
    protected httpService: IHttpService;

    /**
     * Odoo connection base constructor
     *
     * @param baseUrl - Odoo server base url
     * @param db - Odoo database name
     * @param username - Odoo username
     * @param password - Odoo user password
     * @param protocol - Odoo connection protocol
     * @param httpService - Http service instance
     */
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

    /**
     * Get Odoo server version information, see [[IOdooVersion]]
     *
     * @returns - A Promise.
     */
    public version(): Promise<IOdooVersion> {
        return this.call<IOdooVersion>("common", "version");
    }

    /**
     * Authenticate odoo user
     *
     * @returns - A Promise.
     */
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

    /**
     * Get a Odoo model instance, see [[OdooModel]]
     *
     * @typeparam TModel - Model custom type
     * @param name - Odoo model name, eq. sale.order
     * @returns - new [[OdooModel]] instance.
     */
    public getModel<TModel = any>(name: string): IOdooModel<TModel> {
        return new OdooModel<TModel>(name, this);
    }

    /**
     * Call Odoo server
     *
     * @typeparam TResult - Result map model
     * @param service - Odoo service name, eq. object
     * @param method  - Odoo method name, eq. search
     * @param args - Odoo method arguments
     * @returns - A Promise.
     */
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

    /**
     * Call odoo server, but first injects authentication arguments. see [[call]]
     *
     * @typeparam TResult - Result map model
     * @param service - Odoo service name, eq. object
     * @param args - Odoo method arguments
     * @returns - A Promise.
     */
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

    /**
     * Builds a odoo server full url
     *
     * @param service - Odoo service name, eq. object
     * @returns - Full odoo server api url
     */
    protected buildUrl(service: string): string {
        return `${this.baseUrl}${this.baseUrl.endsWith("/") ? "" : "/"}${
            this.protocol
        }`;
    }

    /**
     * Builds a request body
     *
     * @param service - Odoo service name, eq. object
     * @param method - Odoo method name, eq. search
     * @returns - Json or Xml body, depends on the protocol, see [[OdooConnectionProtocol]]
     */
    protected abstract buildBody(
        service: string,
        method: string,
        ...args: any[]
    ): string;

    /**
     * Builds the request headers, see [[IHeaders]]
     *
     * @returns - request headers, depends on the protocol, see [[OdooConnectionProtocol]]
     */
    protected abstract buildHeaders(): IHeaders;

    /**
     * Parses odoo api response into an object
     *
     * @typeparam TResult - Body parse type
     * @param body - Response body
     * @returns - Parsed object
     */
    protected abstract parseBody<TResult>(body: any): TResult;
}
