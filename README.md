# ts-printerr (Typescript Print-Errors)

This is a script that runs compile/checks on a single file.

# Why

`npx tsc --project tsconfig.json --noEmit --skipLibCheck` always runs checks on all files in the project, it's impossible to use it for specific files.

The agents gets overwhelmed with output if there are issues. With a rule that says something like "after each change, run compile check on files you touched with this script:   

`ts-node check-files.ts amplify/src/core/effectMarketDataPipeline/optionsMRocService.ts`

Example:

```
➜  backend git:(switch-agent) ✗ ts-node check-files.ts amplify/src/core/DataPipeline/chainsService.ts
[
  {
    "code": 2322,
    "category": "Error",
    "message": "Type '(input: ChainsInputInterface) => Effect.Effect<{ readonly context: { readonly symbol: string; }; readonly chains: readonly { readonly expirations: readonly { readonly type: string; readonly date: string; str...' is not assignable to type '(input: ChainsInputInterface) => Effect<ChainsOutputInterface, ClientError | ParseError | AcquisitionError, never>'.\n  Type 'Effect<{ readonly context: { readonly symbol: string; readonly asOf: string; readonly priceRef: number; }; readonly chains: readonly { readonly expirations: readonly { readonly type: string; readonly date: string; ... }[]; .....' is not assignable to type 'Effect<ChainsOutputInterface, ClientError | ParseError | AcquisitionError, never>' with 'exactOptionalPropertyTypes: true'. Consider adding 'undefined' to the types of the target's properties.\n    Type 'unknown' is not assignable to type 'ClientError | ParseError | DataAcquisitionError'.",
    "file": "amplify/src/core/DataPipeline/chainsService.ts",
    "start": 3554,
    "length": 11,
    "related": [
      {
        "message": "The expected type comes from property 'fetchChains' which is declared here on type 'getChains'",
        "file": "amplify/src/core/DataPipeline/chainsService.ts",
        "start": 1657,
        "length": 11
      }
    ]
  }
]
```

Some return type and declared output differ in structure or optional fields. Agents can figure such errors out in seconds since they get proper context.

# Alternatives

It's possible to check specific files if ` --project tsconfig.json` ommited, but then it requires all the tsconfig options to be in the cli. Maybe I am missing something, but that's how tsc worked for me. 

`npx tsc --noEmit --skipLibCheck --target ES2022 --module ES2022 --moduleResolution bundler amplify/src/core/quotes/index.ts`
