import axios from 'axios';

class Apis {
  constructor(serverMap, apiMap, axiosConfig = {}) {
    this.httpClient = axios.create(axiosConfig);
    this._serverMap_ = serverMap;
    this._apiMap_ = apiMap;

    if (this._validate_) {
      this._format_();
      this._combine_();
    } else {
      console.error('apis: 参数不合法，请检查你的配置参数');
    }

    return this;
  }

  get _validate_() {
    return true;
  }

  get _base_() {
    let base = '';

    for (const key of Object.keys(this._serverMap_)) {
      if (!base) {
        base = key;
      }

      if (this._serverMap_[key].default) {
        base = key;
      }
    }

    if (!base) {
      console.error('apis: 找不到默认服务器配置');
    }

    return base;
  }

  _format_() {
    for (const key of Object.keys(this._apiMap_)) {
      const item = this._apiMap_[key];

      if (!item.server) {
        item.server = this._base_;
      }

      this._apiMap_[key] = Object.assign({},
        this._serverMap_[item.server],
        item
      );
    }
  }

  useReq(fulfilled, rejected) {
    this.httpClient.interceptors.request.use(fulfilled, rejected);
  }

  useRes(fulfilled, rejected) {
    this.httpClient.interceptors.response.use(fulfilled, rejected);
  }

  _restful_(url, rest) {
    const regex = /\:[^/]*/g;

    return url.replace(regex, (p) => {
      const key = p.slice(1);
      if (rest[key]) {
        return rest[key];
      }
      return p;
    });
  }

  _comboo_(bf, af) {
    if (af.rest) {
      af.url = this._restful_(bf.url, af.rest);
    }

    return Object.assign({}, bf, af);
  }

  _namespace_(obj, keys, cb) {
    const key = keys[0];

    if (keys.length === 1) {
      obj[key] = obj[key] || cb;
    } else {
      obj[key] = obj[key] || {};
      this._namespace_(obj[key], keys.slice(1), cb);
    }
  }

  _combine_() {
    for (const key of Object.keys(this._apiMap_)) {
      const keys = key.replace(/^\//, '').split('/');
      this._namespace_(this, keys, (config) => {
        let result = this._apiMap_[key];
        if (config) {
          result = this._comboo_(this._apiMap_[key], config);
        }
        return this.httpClient.request(result);
      });
    }
  }
}

// 声明该方法是因为在typescript class(d.ts)需要拓展类型
Apis.create = function(serverMap, apiMap, axiosConfig = {}) {
  return new Apis(serverMap, apiMap, axiosConfig);
};

Apis.useReq = function() {
  console.error('Apis: Apis.useReq已废弃，请使用实例上 useReq 方法');
};
Apis.useRes = function() {
  console.error('Apis: Apis.useRes 已废弃，请使用实例上 useRes 方法');
};

export default Apis;