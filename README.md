# ts-printerr (Typescript Print-Errors)

This is a script that runs compile/checks on a single file.

# Why

`npx tsc --project tsconfig.json --noEmit --skipLibCheck` always runs checks on all files in the project, it's impossible to use it for specific files.

The agents gets overwhelmed with output if there are issues. With a rule that says something like "after each change, run compile check on files you touched with this script:   

`ts-node check-files.ts amplify/src/core/effectMarketDataPipeline/optionsMRocService.ts`" 

And the agent will be happy to collect fast feedback and fix issues.

# Alternatives

It's possible to check specific files if ` --project tsconfig.json` ommited, but then it requires all the tsconfig options to be in the cli. Maybe I am missing something, but that's how tsc worked for me. 

`npx tsc --noEmit --skipLibCheck --target ES2022 --module ES2022 --moduleResolution bundler amplify/src/core/quotes/index.ts`
