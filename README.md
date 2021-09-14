# apis

[![npm version](https://img.shields.io/npm/v/@shadasd/apis.svg)](https://www.npmjs.com/package/@shadasd/apis)
[![license](https://img.shields.io/npm/l/@shadasd/apis.svg)](https://www.npmjs.com/package/@shadasd/apis)

基于 [axios](https://github.com/axios/axios) 封装的接口管理方案，[@shadasd/apis](https://www.npmjs.com/package/@shadasd/apis)

## 使用

1. 使用`Apis.create`创建apis实例

2. 废弃静态拦截器`Apis.useReq`,`Apis.useRes`, 请使用实例方法`apis.useReq`,`apis.useRes`

## Features

- 接口统一管理
- 可配置多个接口服务
- 支持 restful 接口
- 支持命名空间

## Installing

```
$ npm install @shadasd/apis
```

## 按需引用（推荐✅）
```typescript
// src/types/apis-keys.d.ts
declare const globalKeys: ['getRecordList','getAuditlist','postEnableQ','postDisableQ','postAuditQ','postDeleteQ','getQDetail','postUpload','postCreateQ','getTemplate']

// src/utils/apis.ts
const apis = Apis.create<typeof globalKeys>(serverMap, apiMap)

4. 在具体的组件中使用
// src/pages/Home/index.tsx
import apis from '@/utils/apis'

interface DemoData {
  name: string
  age: number
  is_active: boolean
}

const Home = () => {

  const fetchData = async() => {
    const result = await apis.getRecordList<DemoData>()

    console.log(result.code)
    console.log(result.msg)
    console.log(result.name)
    console.log(result.age)
    console.log(result.is_active)
  }

  return <div>Home Page</div>
}

```

## 挂载到全局Windows（不推荐❌）
```typescript
//d.ts file
import { ApisInstance } from '@shadasd/apis';
declare global {
  type ApisKeys = ['getDemo', 'memberQuery', 'memberLogQuery'];
  interface Window {
    apis: ApisInstance<ApisKeys>;
  }
}

// src/pages/Home/index.tsx
const Home = () => {
  const fetchData = async() => {
    const result = await window.apis.getDemo<DemoData>()
  }

  return <div>Home Page</div>
}

```

## Syntax

```typescript
Apis.create<ApisKeys>(serverMap, apiMap);
```

### Response 类型
请求接口返回的数据类型，默认为：`ApisResponse`。自定义可以通过，`ApisInstance`或者`Apis.create` 泛型的第二个参数进行全局设置。而每个方法的第二个泛型参数可进行独立设置 `eg:apis.getBaseInfoId<string[], {error: string; errorMsg: string}>()`

## Parameters

#### serverMap

- serverMap 是服务配置的 map 对象
- 服务的参数配置同 axios 中的 [config](https://github.com/axios/axios#request-config) 部分
- default 为自定义属性，当 default 为 true 时，api 会使用它做为默认服务配置

```json
{
  "baseServer": {
    "default": true,
    "baseUrl": "https://base.apis.com"
  }
}
```

#### apiMap

- apiMap 是接口配置的 map 对象
- 接口的参数配置同 axios 中的 [config](https://github.com/axios/axios#request-config) 部分，会覆盖服务配置中的参数
- server 为自定义属性，表示使用哪个服务配置，当 server 为 null 时，表示使用默认服务配置

```json
{
  "getBaseInfo": {
    "method": "get",
    "url": "/info"
  }
}
```

## Custom

#### rest：restful 参数

当接口中需要传递 restful 参数时，按如下配置

配置时用`:`标记：

```json
// request method - GET
{
  "getBaseInfoId": {
    "method": "get",
    "url": "/info/:id"
  }
}
```

调用时参数中添加 `rest` 参数：

```javascript
apis.getBaseInfoId({
  rest: {
    id: 1
  }
});

```

### PUT、POST、DELETE
涉及到 HTTP-Request 携带 Request-Body 时

```json
// request method - POST
{
  "postCreateInfo": {
    "method": "post",
    "url": "/info"
  }
}
```

```javascript
apis.postCreateInfo({
  data: {
    name: 'jerry',
    age: 18
  }
})
```

调用请求传参和 Axios 保持一致，即：
```typescript
// axios-lib/index.d.ts

export interface AxiosRequestConfig {
  url?: string;
  method?: string;
  baseURL?: string;
  transformRequest?: AxiosTransformer | AxiosTransformer[];
  transformResponse?: AxiosTransformer | AxiosTransformer[];
  headers?: any;
  params?: any;
  paramsSerializer?: (params: any) => string;
  data?: any;
  timeout?: number;
  withCredentials?: boolean;
  adapter?: AxiosAdapter;
  auth?: AxiosBasicCredentials;
  responseType?: string;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  onUploadProgress?: (progressEvent: any) => void;
  onDownloadProgress?: (progressEvent: any) => void;
  maxContentLength?: number;
  validateStatus?: (status: number) => boolean;
  maxRedirects?: number;
  httpAgent?: any;
  httpsAgent?: any;
  proxy?: AxiosProxyConfig | false;
  cancelToken?: CancelToken;
  ...
}

```

## Namespace

apiMap 的 `key` 中出现的 `/` 会解析为对应的命名空间路径，不需要命名空间时，不加 `/` 即可

```
e.g: auth/user/getInfo => auth.user.getInfo()
```

```javascript
{
  'user/getInfo':{
    method: "get"
    server: "baseServer"
    url: "/user/info"
  }
}

=> apis.user.getInfo()
```

## Interceptors

Apis 实例通过`useReq`,`useRes`两个接口对请求做拦截，可以多次调用，添加多个 middleware

#### instance.useReq(middleware)

同 [axios.interceptors.request.use](https://github.com/axios/axios#interceptors)

```javascript
apis.useReq(function(config) {
  config.headers.Authorization = "Bearer";
  return config;
});
```

#### instance.useRes(middleware)

同 [axios.interceptors.response.use](https://github.com/axios/axios#interceptors)

```javascript
apis.useRes(function(res) {
  res.msg = "ok";
  return res;
});
```

## License

MIT
