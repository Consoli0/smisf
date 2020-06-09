# Standard Microwave Instruction String Format (SMISF)

#### What?

SMISF is a format for encoding microwave instructions into a string.

#### Why?

Because I can

# Usage

Install `smisf`:

```bash
npm install --save smisf
```

If you're using CommonJS (default), require `smisf`:

```js
const smisf = require('smisf');
```

If you're using ESM, import `smisf`:

```ts
import * as smisf from 'smisf';
```

# API

```ts
const creator = new smisf.Creator();
creator.cook(minutes, seconds, powerLevel); // Add a cook instruction // powerLevel can be either: "HI", Or a multiple of 10 from 00 to 90

creator.change('M'); // Apply a single change // A single letter
creator.change(['U', 'F', 'S']); // Apply multiple changes // Each a single letter

creator.value; // Get string

creator.do(); // Get string and clear, ready for another instruction set
```

```ts
const parse = smisf.parse; // Just a shorthand
parse(string); // Parse an instruction string, returns an array of objects, see <Parsed value types> for object types
```

### Parsed value types:

```ts
{
  type: 'cook',
  powerLevel: 'HI' | number,
  minutes: number,
  seconds: number,
  fullSeconds: number // (minutes * 60) + seconds
} | {
  type: 'change',
  changes: Array<string>
}
```

## Example

```ts
import * as smisf from 'smisf';
import { inspect } from 'util';

const c = new smisf.Creator();
const created = c.cook(1, 0, 'HI').change('F').cook(0, 45, 'HI').do();
const parsed = smisf.parse(created);

console.log(`Created: ${c.cook(1, 0, 'HI').change('F').cook(0, 45, 'HI').do()}`);
console.log(`Parsed: ${inspect(parsed)}`);
```

# Format

Instruction strings should be UTF-8

### Syntax

```
<SMISF=args>
args can be one/several of the following:
  ;POWERLEVEL#MINS:SECONDS
    POWERLEVEL can be either:
      HI
      Or a multiple of 10 from 00 to 90

    MINS is a number

    SECONDS is a two digit number in the seconds range, for example:
      00
      01
      59

  ;@OPERATIONS
    OPERATIONS can be multiple "operations" (see Operations section)
```

### Operation suggestions

_These are just suggestions, you can implement your own, or not use these at all_

M - Mix  
S - Stir  
F - Flip  
C - Cover  
U - Uncover

### Examples

`<SMISF=;@C;HI#1:35;@UF;30#0:10>` - Cover, 1 minute and 35 seconds on HIGH, Uncover, Flip, 10 seconds on 30.
`<SMISF=;70#25:00>` - Twenty-five minutes on 70

[GitHub](https://github.com/Consoli0/smisf) | [NPM](https://npmjs.com/package/smisf)

If you have a real use for this package, please DM me on Discord at `zt#5963` and tell me why, you really shouldn't have any need for this package.
