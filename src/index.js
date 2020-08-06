import axios from "axios";
class CApis {
  constructor(serverMap, apiMap) {
    this.serverMap = serverMap;
    this.apiMap = apiMap;
    if (this.validate) {
      this.combine();
      this.middleware();
      this.parse();
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

  // 解析 api
  parse() {
    // console.log(this.apiMap, 'apiMap')
  }
}

export default CApis;