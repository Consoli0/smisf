export { default as Creator } from './creator';
export { default as parse } from './parse';

export type Parsed =
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
    };

export type PowerLevel = 'HI' | 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90;
