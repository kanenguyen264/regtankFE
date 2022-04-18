import { get } from "lodash";
import { store } from "./../store";

const getStateInStoreByKey = (key) => {
  const state = store.getState();
  const data = get(state, "settings.locale");
  return data;
};

export { getStateInStoreByKey };
