export class EntityDetailsData {
  key: string;
  value: string | number;

  constructor(key: string, value: string | number) {
    this.key = key;
    this.value = value;
  }
}
