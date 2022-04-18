//@flow
import { mockOnGet, mockOnPost } from "__mock/ApiMock";
import type { AxiosRequestConfig } from "axios";
import { delay } from "@protego/sdk/utils/promises";

let list = {},
  lastId = 0,
  store;

//TODO replace API when ready
class CaseNoteMock {
  constructor(_store) {
    store = _store;
  }

  // just uncomment these decorator for turn off mock
  @mockOnGet(/\/case\/(.+?)\/notes/)
  async getAll(config: AxiosRequestConfig, matches) {
    await delay(150);
    return [200, list[matches[1]] || []];
  }

  @mockOnPost(/\/case\/(.+?)\/note\/save/)
  async save(config: AxiosRequestConfig, matches) {
    await delay(150);
    const response = {
      id: ++lastId,
      ...JSON.parse(config.data),
      createdAt: new Date(),
      createdBy: store.getState().me.me
    };
    list[matches[1]] = [...(list[matches[1]] || []), response];
    return [200, response];
  }
}

export default CaseNoteMock;
