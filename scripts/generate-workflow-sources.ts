import { readFileSync, writeFileSync } from 'node:fs';
import ts from 'typescript';
import { format } from 'prettier';
import { workflows } from '../examples/docs/workflow-data';
const sources: Record<string, Record<string, string>> = {};
for (const kit of ['color-picker', 'theme-studio'] as const) {
  sources[kit] = {};
  const fileName = `examples/docs/${kit === 'color-picker' ? 'color' : 'theme'}-workflows.ts`;
  const source = ts.createSourceFile(
    fileName,
    readFileSync(fileName, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  for (const { id } of workflows[kit]) {
    const transformed = ts.transform(source, [
      (context) => {
        const visit: ts.Visitor = (original) => {
          const node = ts.visitEachChild(original, visit, context);
          if (ts.isBinaryExpression(node)) {
            if (
              node.operatorToken.kind ===
                ts.SyntaxKind.EqualsEqualsEqualsToken &&
              ts.isIdentifier(node.left) &&
              node.left.text === 'id' &&
              ts.isStringLiteral(node.right)
            )
              return node.right.text === id
                ? ts.factory.createTrue()
                : ts.factory.createFalse();
            if (
              node.operatorToken.kind === ts.SyntaxKind.BarBarToken &&
              [ts.SyntaxKind.TrueKeyword, ts.SyntaxKind.FalseKeyword].includes(
                node.left.kind,
              ) &&
              [ts.SyntaxKind.TrueKeyword, ts.SyntaxKind.FalseKeyword].includes(
                node.right.kind,
              )
            )
              return node.left.kind === ts.SyntaxKind.TrueKeyword ||
                node.right.kind === ts.SyntaxKind.TrueKeyword
                ? ts.factory.createTrue()
                : ts.factory.createFalse();
          }
          if (ts.isIfStatement(node)) {
            if (node.expression.kind === ts.SyntaxKind.TrueKeyword)
              return node.thenStatement;
            if (node.expression.kind === ts.SyntaxKind.FalseKeyword)
              return node.elseStatement ?? ts.factory.createBlock([]);
          }
          if (ts.isConditionalExpression(node)) {
            if (node.condition.kind === ts.SyntaxKind.TrueKeyword)
              return node.whenTrue;
            if (node.condition.kind === ts.SyntaxKind.FalseKeyword)
              return node.whenFalse;
          }
          if (
            ts.isFunctionDeclaration(node) &&
            node.name?.text === 'mountWorkflow'
          )
            return ts.factory.updateFunctionDeclaration(
              node,
              node.modifiers,
              node.asteriskToken,
              node.name,
              node.typeParameters,
              node.parameters.filter((p) => p.name.getText(source) !== 'id'),
              node.type,
              node.body,
            );
          return node;
        };
        return (root) => ts.visitNode(root, visit) as ts.SourceFile;
      },
    ]);
    let printed = ts
      .createPrinter()
      .printFile(transformed.transformed[0] as ts.SourceFile);
    transformed.dispose();
    if (!['locks', 'conflict'].includes(id))
      printed = printed
        .replace(/const editor = undefined;/g, '')
        .replace(
          'const store = editor?.store ?? target;',
          'const store = target;',
        )
        .replace(/if \(editor\)\s+cleanup.push\(editor.destroy\);/g, '');
    printed = printed.replace(/\{\s*\}/g, '');
    const focused = ts.createSourceFile(
      'workflow.ts',
      printed,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS,
    );
    const used = new Set<string>();
    const gather = (node: ts.Node) => {
      if (ts.isImportDeclaration(node)) return;
      if (ts.isIdentifier(node)) used.add(node.text);
      ts.forEachChild(node, gather);
    };
    gather(focused);
    const pruned = ts.factory.updateSourceFile(
      focused,
      focused.statements
        .map((statement) => {
          if (
            !ts.isImportDeclaration(statement) ||
            !statement.importClause ||
            !statement.importClause.namedBindings ||
            !ts.isNamedImports(statement.importClause.namedBindings)
          )
            return statement;
          const bindings = statement.importClause.namedBindings.elements.filter(
            (element) => used.has(element.name.text),
          );
          if (!bindings.length) return undefined;
          return ts.factory.updateImportDeclaration(
            statement,
            statement.modifiers,
            ts.factory.updateImportClause(
              statement.importClause,
              statement.importClause.isTypeOnly,
              statement.importClause.name,
              ts.factory.createNamedImports(bindings),
            ),
            statement.moduleSpecifier,
            statement.attributes,
          );
        })
        .filter((s): s is ts.Statement => Boolean(s)),
    );
    sources[kit][id] = await format(ts.createPrinter().printFile(pruned), {
      parser: 'typescript',
      singleQuote: true,
    });
  }
}
writeFileSync(
  'examples/docs/workflow-sources.ts',
  '// Generated by scripts/generate-workflow-sources.ts.\nexport const workflowSources: Record<string, Record<string, string>> = ' +
    JSON.stringify(sources, null, 2) +
    ';\n',
);
console.log('Generated ten focused workflow sources.');
