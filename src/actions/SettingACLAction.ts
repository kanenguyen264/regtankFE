import { createAwaitAction } from "@protego/sdk/actions/utils";

export const SETTING_ACL_GET_ALL = createAwaitAction<any>("setting-acl/get-all");
export const SETTING_ACL_GET_ONE = createAwaitAction<{id: string|number}>("setting-acl/get-one");

export const SETTING_ACL_UPDATE_ROLE = createAwaitAction<{data: any}>("setting-acl/update-role");

