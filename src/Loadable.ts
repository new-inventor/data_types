import {ObjectHelper} from '@/helpers/ObjectHelper';

export interface ILoadable {
  load(parameters?: { [index: string]: any }): void;
}

export class Loadable implements ILoadable {
  public load(parameters?: { [index: string]: any }): void {
    if (!parameters || typeof parameters !== 'object') {
      return;
    }
    ObjectHelper.forEach(parameters, (item: any, key: string) => {
        // @ts-ignore
        this[key] = parameters[key] as any;
    });
  }
}
