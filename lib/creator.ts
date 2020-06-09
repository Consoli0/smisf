export default class Creator {
  private _value: string;

  constructor() {
    this._value = '<SMISF=';
  }

  cook(minutes: number, seconds: number, powerLevel: 'HI' | 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90): this {
    this._value += `;${powerLevel}#${minutes}:${seconds.toString().padStart(2, '0')}`;
    return this;
  }

  change(values: Array<string> | string): this {
    this._value += ';@';
    if (values instanceof Array) {
      values.forEach(value => {
        if (value.length > 1) throw new TypeError('Changes must be one character long!');
        this._value += value.toUpperCase();
      });
    } else {
      if (values.length > 1) throw new TypeError('Changes must be one character long!');
      this._value += values.toUpperCase();
    }
    return this;
  }

  reset(): this {
    this._value = '<SMISF=';
    return this;
  }

  do(): string {
    let val = this.value;
    this.reset();
    return val;
  }

  get value() {
    return `${this._value}>`;
  }
}
