import axios from "axios";
class CApis {
  constructor(serverMap, apiMap) {
    this.serverMap = serverMap;
    this.apiMap = apiMap;
    this.instance = {
      // 便于直接调用 axios.request
      gRequest: axios.request,
    };
    if (this.validate) {
      this.combine();
      this.middleware();
      this.parse();
      return this.instance;
    } else {
      console.error("参数不合法，请检查你的参数配置");
    }
  }

  static reqMiddleware = [];
  static resMiddleware = [];
  static useReq = function() {
    this.reqMiddleware.push(arguments);
  };
  static useRes = function() {
    this.resMiddleware.push(arguments);
  };

  // 如果后期需要检查的话，可以在这里加
  get validate() {
    if (!this.serverMap || !this.apiMap) {
      return false;
    }
    return true;
  }

  // 获取 serverMap 中的 default server
  get base() {
    let base = "";
    for (const key of Object.keys(this.serverMap)) {
      if (!base) {
        base = key;
      }
      if (this.serverMap[key].default) {
        base = key;
      }
    }
    if (!base) {
      console.error("没有找到默认的服务器配置");
    }
    return base;
  }

  // 整合 apiMap
  combine() {
    for (const key of Object.keys(this.apiMap)) {
      const item = this.apiMap[key];

      if (!item.server) {
        item.server = this.base;
      }

      this.apiMap[key] = Object.assign({}, this.serverMap[item.server], item);
    }
  }

  // 中间件 axios 拦截器
  middleware() {
    CApis.reqMiddleware.map((middleware) => {
      axios.interceptors.request.use(...middleware);
    });

    CApis.resMiddleware.map((middleware) => {
      axios.interceptors.response.use(...middleware);
    });
  }

  // 挂载 api 至 instance 上
  namespace(obj, keys, cb) {
    const key = keys[0];

    if (keys.length === 1) {
      obj[key] = obj[key] || cb;
    } else {
      obj[key] = obj[key] || {};
      this.namespace(obj[key], keys.slice(1), cb);
    }
  }

  // 参数
  comboo(api, config) {
    if (config.rest) {
      // 替换 rest 参数
      config.url = this.restful(api.url, config.rest);
    }
    return Object.assign({}, api, config);
  }

  // restful
  restful(url, restParams) {
    const regex = /\:[^/]*/g;
    return url.replace(regex, (p) => {
      const key = p.slice(1);
      if (restParams[key]) {
        return restParams[key];
      }
      return p;
    });
  }

  // 解析 api
  parse() {
    for (const key of Object.keys(this.apiMap)) {
      const keys = key.replace(/^\//, "").split("/");
      this.namespace(this.instance, keys, (config) => {
        let resultApi = this.apiMap[key];
        if (config) {
          // 如果有 params、data、rest
          resultApi = this.comboo(resultApi, config);
        }
        return axios.request(resultApi);
      });
    }
  }
}

export default CApis;