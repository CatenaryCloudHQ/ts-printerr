# ts-printerr (Typescript Print-Errors)

This is a script that runs a full compile/checks on a project but filters and formats errors output only for the specific file(s).

# Why

`npx tsc --project tsconfig.json --noEmit --skipLibCheck` always runs checks on all project files. Is is impossible to use it to compile and check "selected" files. 

The agents gets overwhelmed with the project compile output, especially if there are a lot of issues during refactoring.

Now with a rule that says something like "after each change or update, run compile check on files you touched with this script:   

`ts-node check-files.ts amplify/src/core/effectMarketDataPipeline/optionsMRocService.ts`

Example of the output:

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

I truncated the output a bit. The errors shows some incompatible return type with declared output in the structure or optional fields. Agents can figure such errors out in seconds since they get proper context, which makes this script a great feedback loop for agents.

# Alternatives

It's possible to check specific files if ` --project tsconfig.json` ommited, but then it requires all the tsconfig options to be in the cli. Maybe I am missing something, but that's how tsc worked for me. 

`npx tsc --noEmit --skipLibCheck --target ES2022 --module ES2022 --moduleResolution bundler amplify/src/core/quotes/index.ts`
