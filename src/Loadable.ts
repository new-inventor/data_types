import forOwn from 'lodash/forOwn';

export interface ILoadable {
  load(parameters?: { [index: string]: any }): void;
}

export class Loadable implements ILoadable {
  public load(parameters?: { [index: string]: any }): void {
    if (!parameters || typeof parameters !== 'object') {
      return;
    }
    forOwn(parameters, (item: any, key: string) => {
        // @ts-ignore
        this[key] = parameters[key] as any;
    });
  }
}
