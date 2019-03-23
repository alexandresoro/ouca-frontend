export class ListHelper {
  public static getFromList(list: any[], field: string, valueToFind: any): any {
    return list.find((object) => object[field] === valueToFind);
  }
}
