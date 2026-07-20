const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.next' && f !== '.git') {
        walkDir(dirPath, callback);
      }
    } else {
      if (dirPath.endsWith('.ts') || dirPath.endsWith('.tsx')) {
        callback(dirPath);
      }
    }
  });
}

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Skip the observability core files themselves
  if (filePath.includes('/observability/')) return;
  // Skip this script
  if (filePath.includes('migrate_observability')) return;

  let hasChanges = false;

  // Check if we need to replace
  if (content.includes('console.log') || content.includes('console.error') || content.includes('console.warn')) {
    
    // Add import if not present
    if (!content.includes('import { Observability }')) {
      // Find last import
      const importMatches = [...content.matchAll(/^import .* from .*$/gm)];
      if (importMatches.length > 0) {
        const lastMatch = importMatches[importMatches.length - 1];
        const insertPos = lastMatch.index + lastMatch[0].length;
        content = content.slice(0, insertPos) + '\nimport { Observability } from "@/lib/infrastructure/observability";' + content.slice(insertPos);
      } else {
        content = 'import { Observability } from "@/lib/infrastructure/observability";\n' + content;
      }
    }

    // Replace usages
    content = content.replace(/console\.log/g, 'Observability.getLogger("System").info.bind(Observability.getLogger("System"), "Log")');
    content = content.replace(/console\.error/g, 'Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")');
    content = content.replace(/console\.warn/g, 'Observability.getLogger("System").warn.bind(Observability.getLogger("System"), "Warn")');
    
    hasChanges = true;
  }

  if (hasChanges && content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Migrated: ${filePath}`);
  }
}

const rootDir = path.join(__dirname, '..');
['app', 'components', 'lib'].forEach(dir => {
  walkDir(path.join(rootDir, dir), migrateFile);
});

console.log("Migration complete.");
