import { expect } from 'chai';
import * as smisf from '.';

const fromHex = (hex: string): string => Buffer.from(hex, 'hex').toString('utf-8');

describe('Creator', () => {
  let c = new smisf.Creator();

  describe('<constructor>', () => {
    it('Should create and return a Creator', (done: Mocha.Done) => {
      expect(c).to.be.instanceOf(smisf.Creator);
      done();
    });
  });

  describe("#cook(minutes: number, seconds: number, powerlevel: 'HI' | <0 - 90>", () => {
    it('Should not error', (done: Mocha.Done) => {
      c.cook(1, 45, 'HI').reset();
      done();
    });

    it('Should queue a cook action', (done: Mocha.Done) => {
      expect(c.cook(1, 45, 'HI').do()).to.be.equal('<SMISF=;HI#1:45>');
      done();
    });
  });

  describe('#change(values: string | Array<string>)', () => {
    it('Should not error', (done: Mocha.Done) => {
      c.change('T').change(['E', 'S', 'T']).reset();
      done();
    });

    it('Should queue a change/multiple change actions', (done: Mocha.Done) => {
      expect(c.change('T').do()).to.be.equal('<SMISF=;@T>');
      expect(c.change(['T', 'E']).do()).to.be.equal('<SMISF=;@TE>');
      done();
    });
  });

  describe('#reset()', () => {
    it('Should not error', (done: Mocha.Done) => {
      c.change('T').change(['E', 'S', 'T']).reset();
      done();
    });

    it('Should reset queue', (done: Mocha.Done) => {
      expect(c.change('T').reset().do()).to.be.equal('<SMISF=>');
      done();
    });
  });

  describe('#do()', () => {
    it('Should not error', (done: Mocha.Done) => {
      c.change('T').change(['E', 'S', 'T']).do();
      done();
    });

    it('Should return proper string queue', (done: Mocha.Done) => {
      expect(c.cook(1, 45, 'HI').change('T').change(['E', 'S', 'T']).do()).to.be.equal('<SMISF=;HI#1:45;@T;@EST>');
      done();
    });

    it('Should reset queue', (done: Mocha.Done) => {
      c.change('T').do();
      expect(c.value).to.be.equal('<SMISF=>');
      done();
    });
  });
});

describe('parse(str: string)', () => {
  it('Should parse correctly', (done: Mocha.Done) => {
    let creator = new smisf.Creator();
    let created = creator.cook(1, 45, 70).change('T').change(['E', 'S']).do();
    let parsed = smisf.parse(created);

    expect(parsed).to.deep.equal([
      {
        type: 'cook',
        powerLevel: 70,
        minutes: 1,
        seconds: 45,
        secondsFull: 105,
      },
      { type: 'change', changes: ['T'] },
      { type: 'change', changes: ['E', 'S'] },
    ]);
    done();
  });

  it('Should error on invalid tokens', (done: Mocha.Done) => {
    let created = '<SMISF=avfeavsrtavsd>';

    try {
      smisf.parse(created);
    } catch (e) {
      done();
    }
  });
});
