export interface IHttpService {
  post: <T = any>(url: string, data: any, headers: any) => Promise<T>;
}
