export class Singleton {
  private static instance: Singleton | undefined;

  public static make(...params: any[]) {
    if (this.instance === undefined) {
      this.instance = new this(...params);
    }
    return this.instance;
  }

  constructor(...params: any[]) {
    // base constructor interface
  }
}
