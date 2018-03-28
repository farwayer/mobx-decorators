import {IObjectDidChange, IObjectWillChange} from 'mobx'

export function observe(
  onChanged: (change: IObjectDidChange) => void,
  invokeBeforeFirstAccess?: boolean,
): any;

export interface Serializer {
  load?: (data: any) => any,
  save?: (value: any) => any,
}

export interface SaveOptions {
  storage?: any,
  storeName?: string,
  serializer?: Serializer,
  onLoaded?: (store: any, property: string, value: any) => void,
  onSaved?: (store: any, property: string, value: any) => void,
  onInitialized?: (store: any, property: string, value: any) => void,
}

export function intercept(onWillChange: (change: IObjectWillChange) => void): any;
export function _interceptReads(onRead: (value: any) => any): any;
export function save(options?: SaveOptions): any;
export function save(target: any, propertyKey: string): any;
export function createSaveDecorator(baseOptions?: SaveOptions): any;
export function setter(target: any, propertyKey: string): any;
export function setter(name?: string, constValue?: any): any;
export function setter(name?: string, transformFn?: (value: any) => any): any;
export function toggle(target: any, propertyKey: string): any;
export function toggle(name?: string): any;
