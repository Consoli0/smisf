const cookRegex = /\/(HI|[0-9]0)#([0-9]+):([0-5][0-9])/;
const changeRegex = /\/([MSFCU]+)/;

const toHex = (str: string): string => Buffer.from(str).toString('hex');
const fromHex = (hex: string): string => Buffer.from(hex, 'hex').toString('utf-8');

export class Creator {
  _value: string;

  constructor() {
    this._value = '<SMISF=';
  }

  cook(minutes: number, seconds: number, powerLevel: 'HI' | 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90): this {
    this._value += `/${powerLevel}#${minutes}:${seconds.toString().padStart(2, '0')}`;
    return this;
  }

  change(values: Array<string> | string): this {
    this._value += '/';
    if (values instanceof Array) {
      values.forEach((value) => {
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
    let val = this.toString();
    this.reset();
    return val;
  }

  toString(noHex: boolean = false): string {
    return noHex ? this._value + '>' : toHex(this._value + '>');
  }
}

const parseSingularCommand = (
  str: string
):
  | null
  | {
      type: 'cook';
      powerLevel: 'HI' | number;
      minutes: number;
      seconds: number;
      secondsFull: number;
    }
  | {
      type: 'change';
      changes: Array<string>;
    } => {
  if (cookRegex.test(str)) {
    let res = str.match(cookRegex);
    return {
      type: 'cook',
      powerLevel: res[1] === 'HI' ? 'HI' : parseInt(res[1]),
      minutes: parseInt(res[2]),
      seconds: parseInt(res[3]),
      secondsFull: parseInt(res[2]) * 60 + parseInt(res[3]),
    };
  } else if (changeRegex.test(str)) {
    return {
      type: 'change',
      changes: str.replace('/', '').split(''),
    };
  } else return null;
};

export const parse = (
  str: string
): Array<
  | {
      type: 'cook';
      powerLevel: 'HI' | number;
      minutes: number;
      seconds: number;
      secondsFull: number;
    }
  | {
      type: 'change';
      changes: Array<string>;
    }
> => {
  str = fromHex(str);
  str.replace(/<SMISF=/g, '').replace(/>/g, '');

  let ret = [];
  let res = [...str.matchAll(/\/(?:(?:(?:HI|[0-9]0)#[0-9]+:[0-5][0-9])|(?:[MSFCU]+))/g)];

  res.forEach((v) => {
    let parsed = parseSingularCommand(v[0]);
    if (parsed) ret.push(parsed);
  });

  return ret;
};

export function* stepper(SMISFString: string) {
  for (let v of parse(SMISFString)) {
    yield v;
  }
}
