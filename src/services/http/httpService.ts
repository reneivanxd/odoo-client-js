export interface IHttpService {
  post: (url: string, data: any, headers: any) => Promise<string>;
}
