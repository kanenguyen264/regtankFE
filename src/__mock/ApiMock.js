//@flow
import MockAdapter from "axios-mock-adapter";
import ApiService from "../services/ApiService";
import { AxiosRequestConfig } from "axios";

const mock = new MockAdapter(ApiService._api, {
  onNoMatch: "passthrough"
});

function reply(matcher: string | RegExp, descriptor, target) {
  return (config: AxiosRequestConfig) => {
    console.log(target);
    if (typeof matcher === "string")
      return descriptor.value.call(target, config);
    return descriptor.value.call(target, config, matcher.exec(config.url));
  };
}

export function mockOnGet(matcher: string | RegExp) {
  return (target, key, descriptor) => {
    mock.onGet(matcher).reply(reply(matcher, descriptor, target));
  };
}
export function mockOnPost(matcher: string | RegExp) {
  return (target, key, descriptor) => {
    mock.onPost(matcher).reply(reply(matcher, descriptor, target));
  };
}
