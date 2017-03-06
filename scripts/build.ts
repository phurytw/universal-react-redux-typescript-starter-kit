/**
 * @file Builds the webpack bundle
 */
import * as webpack from "webpack";
import webpackConfig from "../webpack.config";
import * as ts from "typescript";

// Build webpack
webpack(webpackConfig(process.env.NODE_ENV)).run((err: Error, stats: webpack.Stats) => {
    if (err) {
        throw err;
    }
    console.log(stats.toString({
        colors: true
    }));
});

// Build server app
let program = ts.createProgram(["./src/server.tsx"], {
    lib: ["lib.es6.d.ts"],
    jsx: ts.JsxEmit.React,
    noEmitOnError: true,
    noImplicitAny: true,
    noUnusedLocals: true,
    sourceMap: true,
    outDir: "./dist/server",
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS
});
let emitResult = program.emit();
let allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
allDiagnostics.forEach(diagnostic => {
    let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
    let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
    console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
});
if (emitResult.emitSkipped) {
    throw new Error("Server compilation failed");
} else {
    console.log("Server successfully compiled");
}

