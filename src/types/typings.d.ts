/* eslint-disable typescript-sort-keys/interface */
import { ServiceResponse } from "@protego/sdk/core/AuthService";
import "@redux-saga/core/effects";
import "notistack";
import * as React from "react";
import { ComponentType as Component } from "react";
import "react-redux";
import { PageResult } from "../../../../protego-fe-sdk/src/types";
import { IAttachmentReducerState } from "../reducers/AttachmentReducer";
import { ICaseReducerState } from "../reducers/CaseReducer";
import { IKYCReducerState } from "../reducers/KYCReducer";
import type {
  BasicUserInfoDto,
  KytRequestDto,
  NoteDtoRes,
  ScoringDto,
  SettingScoringDto,
  TransactionEntity
} from "./typings-api";

export interface KYTDetailNote {
  createdAt: Date;
  note: string;
}

export interface KYTDetail {
  asset: string;
  balance: number;
  geo: string;
  id: string;
  notes: KYTDetailNote[];
  reference: string;
  risk: number;
  screenedBy: Date;
  walletAddress: string;
}

/**
 * @ilyatruong truly mapped from CP API Schemas
 * @see https://clientportal-uat-server.regtank.io/swagger-ui/index.html
 */

export * from "./typings-api";

export type KYTReducerState = {
  assets: Array<string | [string, string]>;
  current: KytRequestDto;
  favorites: any[];
  list: PageResult<KytRequestDto>;
  archiveList: PageResult<KytRequestDto>;
  notes: [];
  status: any;
  transactions: {
    [id: string]: PageResult<TransactionEntity>;
  };
  watchList: KytRequestDto[];
};
export type SettingScoringReducerState = {
  FATFDataCurrent: ScoringDto;
  listSetting: SettingScoringDto[];
  WeightSettingCurrent: object;
  detail: ScoringDto;
  OtherSettingCurrent: object;
};

export interface RootState {
  [k: string]: object;
  kyc: IKYCReducerState;
  kyt: KYTReducerState;
  settingScoring: SettingScoringReducerState;
}

export interface NoteService {
  delete(id: string): ServiceResponse<void>;

  getAll(typeId: string, ...args: any[]): ServiceResponse<Array<NoteDtoRes>>;

  getOne(id: string, ...args: any[]): ServiceResponse<NoteDtoRes>;

  save(typeId: string, body: NoteDtoRes): ServiceResponse<NoteDtoRes>;
}

export interface ArchiveService<T> {
  getAll(...args: any[]): ServiceResponse<PageResult<T>>;
  addToArchive(typeId: string[]): ServiceResponse<void>;
  remove(typeId: string[]): ServiceResponse<void>;
}

declare global {
  interface INoteState {
    notes: {
      [key: string]: NoteDtoRes;
    };
  }
  interface IStaffState {
    listStaff: BasicUserInfoDto[];
  }
  type PartialFormikInitial<T> =
    | T
    | {
        [P in keyof T]?: T[P] | string | number | null;
      };
}

// augment for eliminating TS error
declare module "@date-io/type" {
  import { Moment } from "moment";

  export type DateType = Moment;
}
declare module "react-redux" {
  interface DefaultRootState {
    [k: string]: object;
    attachment: IAttachmentReducerState;
    case: ICaseReducerState;
    kyc: IKYCReducerState;
    kyt: KYTReducerState;
    me: {
      me: BasicUserInfoDto;
    };
    settingScoring: SettingScoringReducerState;
    staff: IStaffState;
  }
}

// For SCSS
declare module "*.module.scss" {
  const styles: { [key: string]: string };
  export default styles;
}
// declare module "react-moment" {
//   interface MomentProps {
//     children?: string | number | Date | moment.Moment | TimestampRes;
//   }
// }
declare module "recompose" {
  interface HOC<P, C extends React.ComponentType<any>> {
    (component: C & React.ComponentType<P>);
  }

  interface ComponentEnhancer<TInner, TOuter> {
    (component: Component<TInner>): Component<TOuter>;
  }

  export function compose(f1: HOC<P>): ComponentEnhancer<P, any>;
}


export interface GroupListService {
  getAll(typeId: string, ...args: any[]): ServiceResponse<any>;
  searchToGroup(id: string, ...args: any[]): ServiceResponse<any>;
  createGroup(typeId: string, body: any): ServiceResponse<any>;
  addToGroup(typeId: string, body: any): ServiceResponse<any>;
  renameGroup(typeId: string, body: any): ServiceResponse<any>;
  removeGroup(id: string): ServiceResponse<void>;
  removeInGroup(id: string): ServiceResponse<void>;
}

// declare module "@redux-saga/core/effects" {
//   // export function* call(
//   //   fn: (arg1: A) => ServiceResponse<P>,
//   //   arg1: A
//   // ): Generator<AxiosResponse<P>>;
//   export interface select<TState = DefaultRootState, TSelected = unknown> {
//     (selectorFn: (state: TState) => TSelected): SelectEffect;
//   }
// }
