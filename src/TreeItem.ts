import {IClonable} from './Clonable';
import get from 'lodash/get';

export enum WalkType {
  PRE_ORDER = 'walkPreOrder',
  POST_ORDER = 'walkPostOrder',
  WIDE = 'walkWide',
}

export class TreeItem<T> implements IClonable<TreeItem<T>> {
  constructor(public data?: IClonable<T> | T, public children: TreeItem<T>[] = []) {
  }

  public filter(callback: (node: TreeItem<T>) => boolean): TreeItem<T> {
    const res = [];
    for (const child of this.children) {
      const filteredNode = child.filter(callback);
      if (callback(filteredNode)) {
        res.push(filteredNode);
      } else {
        res.push(...filteredNode.children);
      }
    }
    return new TreeItem(this.data, res);
  }

  public find(callback: (node: TreeItem<T>) => boolean): TreeItem<T> | undefined {
    let res;
    this.walkPreOrder((node: TreeItem<T>) => {
      if (callback(node)) {
        res = node;
        return node;
      }
    });
    return res;
  }

  public hasChild(callback: (node: TreeItem<T>) => boolean): boolean {
    return this.children.reduce((acc: boolean, child: TreeItem<T>) => {
      return acc || !!child.walkPreOrder((node: TreeItem<T>) => {
        if (callback(node)) {
          return true;
        }
      });
    }, false);
  }

  get hasNoChildren(): boolean {
    return this.children.length === 0;
  }

  get hasChildren(): boolean {
    return this.children.length !== 0;
  }

  public walkPreOrder(callback: (node: TreeItem<T>) => any | undefined): any | undefined {
    const res = callback(this);
    if (res !== undefined) {
      return res;
    }
    for (const child of this.children) {
      const result = callback(child);
      if (result !== undefined) {
        return result;
      }
      child.walkPreOrder(callback);
    }
  }

  public walkPostOrder(callback: (node: TreeItem<T>) => any | undefined): any | undefined {
    for (const child of this.children) {
      child.walkPostOrder(callback);
      const res = callback(child);
      if (res !== undefined) {
        return res;
      }
    }
    return callback(this);
  }

  public walkWide(callback: (node: TreeItem<T>) => any | undefined): any | undefined {
    const q: TreeItem<T>[] = [this];
    while (q.length > 0) {
      const node = q.shift() as TreeItem<T>;
      const res = callback(node);
      if (res !== undefined) {
        return res;
      }
      if (node.children) {
        q.push(...node.children);
      }
    }
  }

  public toArray(type: WalkType) {
    const res: (IClonable<T> | T)[] = [];
    this[type]((node) => {
      if (node.data) {
        res.push(node.data);
      }
    });
    return res;
  }

  public static fromArray(arr: any[], idKey: string, parentIdPath: string | string[]): TreeItem<any> {
    const tree = new TreeItem();
    const list: {[index: string]: TreeItem<any>} = {};
    for (const department of arr) {
      list[department[idKey]] = new TreeItem(department);
    }
    // @ts-ignore
    for (const node of Object.values(list)) {
      const parentId = get(node.data as any, parentIdPath, undefined);
      if (parentId === undefined || !list.hasOwnProperty(parentId)) {
        tree.children.push(node);
      } else {
        list[parentId].children.push(node);
      }
    }
    return tree;
  }

  public clone(): TreeItem<T> {
    return new TreeItem(
      this.data && 'clone' in this.data ? this.data.clone() : this.data,
      this.children.reduce((acc: TreeItem<T>[], item: TreeItem<T>) => {
        acc.push(item.clone());
        return acc;
      }, [])
    );
  }
}
