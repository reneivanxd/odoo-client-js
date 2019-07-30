export interface IHeaders {
    [key: string]: string;
}
export interface IHttpService {
    post: (url: string, data: any, headers: IHeaders) => Promise<any>;
}
