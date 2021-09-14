import { AxiosRequestConfig, AxiosInstance } from "axios";

export * from "axios";

type useReq = AxiosInstance["interceptors"]["request"]["use"];
type useRes = AxiosInstance["interceptors"]["response"]["use"];
type TypeTuple<T extends string[]> = T[number];

export type ApisResponse = {
  code: number;
  msg: string;
  /**
   * @description !!!服务端新规范中添加新返回字段 为可选的返回值（业务相关），类型可为：null / number / string /  json
   * @host https://forchange.yuque.com/forchangebe/programming/wh8b50
   */
  opt?: null | number | string | any;

  /**
   * @description !!!服务端新规范中添加新返回字段 pagination 用作列表分页信息
   * @host https://forchange.yuque.com/forchangebe/programming/wh8b50
   */
  pagination?: {
    page: number;

    pageSize: number;

    /**
     * 总页数
     */
    total: number;
  };
};

export type ApisInstance<T extends string[] = [], R = ApisResponse> = Apis &
  ApisMethods<T, R>;

export type ApisMethods<T extends string[], R = ApisResponse> = {
  [key in TypeTuple<T>]: ApisCall<R>;
};

export type ApisCall<R> = <T = any, S = R>(
  config?: ApisRequestConfig
) => Promise<{ data: T } & S>;

export interface ApisConfig {
  [key: string]: {
    server?: string;
    url: string;
    method: "get" | "post" | "put" | "delete" | "patch" | "head";
  };
}

export interface ApisRequestConfig extends AxiosRequestConfig {
  rest?: { [key: string]: number | string };
}

declare class Apis {
  httpClient: AxiosInstance;
  constructor(serverMap: object, apiMap: object, config?: AxiosRequestConfig);
  useReq: useReq;
  useRes: useRes;
  /**
   * @deprecated 已废弃，请使用实例上 useRes 方法
   */
  static useRes: (fulfilled?: any, rejected?: any) => void;
  /**
   * @deprecated 已废弃，请使用实例上 useReq 方法
   */
  static useReq: (fulfilled?: any, rejected?: any) => void;

  static create: <T extends string[], R = ApisResponse>(
    serverMap: object,
    apiMap: object,
    config?: AxiosRequestConfig
  ) => ApisInstance<T, R>;
}

export default Apis;
