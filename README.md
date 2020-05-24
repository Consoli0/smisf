# Standard Microwave Instruction String Format (SMISF)

#### What?
SMISF is a format for encoding microwave instructions into a string.

#### Why?
Just like the question "why does my code work", my answer is: I don't know.

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
```js
import * as smisf from 'smisf';
```

To build a microwave instruction set, 

# Format

Instruction strings should be UTF-8, then encoded into HEX.

### Syntax
```
<SMISF=args>
args can be one of the following:
  /POWERLEVEL#MINS:SECONDS
    POWERLEVEL can be either:
      HI
      Or a multiple of 10 from 00 to 90

    MINS is a number

    SECONDS is a two digit number in the seconds range, for example:
      00
      01
      59

  /OPERATIONS
    OPERATIONS can be multiple "operations" (see Operations section)
```

### Operations
M - Mix  
S - Stir  
F - Flip  
C - Cover  
U - Uncover

### Examples
`<SMISF=/C/HI#1:35/UF/30#0:10>` - Cover, 1 minute and 35 seconds on HIGH, Uncover, Flip, 10 seconds on 30.
`<SMISF=/70#25:00>` - Twenty-five minutes on 70

[GitHub](https://github.com/Consoli0/smisf) | [NPM](https://npmjs.com/package/smisf)

If you have a real use for this package, please DM me on Discord at `zt#5963` and tell me why, you really shouldn't have any need for this package.