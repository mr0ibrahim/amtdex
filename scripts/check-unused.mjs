import fs from "node:fs"
import path from "node:path"
import ts from "typescript"

// Follow the same aliases and module resolution rules used by the application build.
const root = process.cwd()
const config = ts.readConfigFile("tsconfig.app.json", ts.sys.readFile)
if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, "\n"))
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root)
const modules = new Map()
for (const filename of parsed.fileNames.filter(file => file.includes("/resources/js/"))) {
  const source = ts.createSourceFile(filename, fs.readFileSync(filename, "utf8"), ts.ScriptTarget.Latest, true)
  const imports = []
  function scan(node) {
    let specifier
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) {
      specifier = node.moduleSpecifier
    } else if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
      specifier = node.arguments[0]
    }
    if (specifier && ts.isStringLiteral(specifier)) {
      const resolved = ts.resolveModuleName(specifier.text, filename, parsed.options, ts.sys).resolvedModule?.resolvedFileName
      if (resolved?.includes("/resources/js/")) imports.push(resolved)
    }
    ts.forEachChild(node, scan)
  }
  scan(source)
  modules.set(filename, imports)
}
const used = new Set()
function visit(filename) {
  if (used.has(filename)) return
  used.add(filename)
  for (const dependency of modules.get(filename) ?? []) visit(dependency)
}
visit(path.resolve("resources/js/app.tsx"))
const unused = [...modules.keys()].filter(file => !used.has(file) && !/\.(test|spec)\.[cm]?[jt]sx?$/.test(file) && !file.endsWith(".d.ts"))
if (unused.length) {
  console.error("Application modules unreachable from the Vite entry:\n" + unused.map(file => path.relative(root, file)).join("\n"))
  process.exitCode = 1
} else {
  console.log(`Checked ${modules.size} source files; no unreachable application modules.`)
}
