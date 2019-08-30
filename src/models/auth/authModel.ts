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
