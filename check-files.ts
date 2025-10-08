import ts from "typescript";
import path from "path";

const target = path.resolve(process.argv[2]);

const configPath = ts.findConfigFile("./", ts.sys.fileExists, "tsconfig.json");
if (!configPath) throw new Error("Cannot find tsconfig.json");

const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, "./");

const program = ts.createProgram({
  rootNames: parsed.fileNames,
  options: { ...parsed.options, noEmit: true, skipLibCheck: true }
});

const allDiagnostics = [
  ...program.getSyntacticDiagnostics(),
  ...program.getSemanticDiagnostics(),
  ...program.getGlobalDiagnostics()
];

function fileMatch(diag: ts.Diagnostic): boolean {
  if (diag.file && path.resolve(diag.file.fileName) === target) return true;
  const rel = diag.relatedInformation ?? [];
  for (const r of rel) {
    if (r.file && path.resolve(r.file.fileName) === target) return true;
  }
  return false;
}

const relevant = allDiagnostics.filter(fileMatch);

const output = relevant.map((d) => ({
  code: d.code,
  category: ts.DiagnosticCategory[d.category],
  message: ts.flattenDiagnosticMessageText(d.messageText, "\n"),
  file: d.file ? path.relative(process.cwd(), d.file.fileName) : undefined,
  start: d.start,
  length: d.length,
  related: (d.relatedInformation ?? []).map((r) => ({
    message: ts.flattenDiagnosticMessageText(r.messageText, "\n"),
    file: r.file ? path.relative(process.cwd(), r.file.fileName) : undefined,
    start: r.start,
    length: r.length
  }))
}));

console.log(JSON.stringify(output, null, 2));
process.exit(relevant.length ? 1 : 0);
