import CApis from "../dist/index.js";

let serverMap = {
  baseServer: {
    default: true,
    baseURL: "https://base.apis.com"
  },
  authServer: {
    baseURL: "https://auth.apis.com"
  },
  orderServer: {
    baseURL: "http://localhost:4320"
  }
};

let apiMap = {
  getBaseInfo: {
    method: "get",
    url: "/info"
  },
  "user/postOrder": {
    server: "orderServer",
    method: "post",
    url: "/order/:id"
  }
};

CApis.useReq(
  function(config) {
    config.headers.Authorization = "Bearer";
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

let apis = new CApis(serverMap, apiMap);

console.log(apis, 'apis')

// window.apis = apis;

// apis.getBaseInfo();

// apis.user.postOrder({
//   rest: {
//     id: 1234
//   }
// });