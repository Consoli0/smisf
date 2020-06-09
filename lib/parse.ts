import * as doken from 'doken';
import { PowerLevel, Parsed } from '.';

const tokenize = doken.createTokenizer({
  rules: [
    doken.regexRule('COOK', /;(HI|[0-9]0)#([0-9]+):([0-5][0-9])/y, {
      value: (
        match: RegExpExecArray
      ): {
        type: 'cook';
        powerLevel: PowerLevel;
        minutes: number;
        seconds: number;
        secondsFull: number;
      } => ({
        type: 'cook',
        powerLevel: match[1] === 'HI' ? 'HI' : <PowerLevel>parseInt(match[1]),
        minutes: parseInt(match[2]),
        seconds: parseInt(match[3]),
        secondsFull: parseInt(match[2]) * 60 + parseInt(match[3]),
      }),
    }),
    doken.regexRule('CHANGE', /;@([A-Z]+)/y, {
      value: (
        match: RegExpExecArray
      ): {
        type: 'change';
        changes: Array<string>;
      } => ({
        type: 'change',
        changes: match[1].split(''),
      }),
    }),
  ],
});

export default (str: string): Array<Parsed> | null => {
  if (!str.startsWith('<SMISF=') || !str.endsWith('>')) return null;

  str = str.substring(7, str.length - 1);

  let ret: Array<Parsed> = [];

  for (let token of tokenize(str)) {
    switch (token.type) {
      case 'COOK':
      case 'CHANGE': {
        ret.push(token.value);
        break;
      }

      default: {
        throw new Error(`Unrecognized token "${token.value}" in SMISF string at ${token.pos}`);
        break;
      }
    }
  }

  return ret;
};
