import { Project, SourceFile } from 'ts-morph';
import path from 'path';

export interface ArchitectureViolation {
  file: string;
  rule: string;
  message: string;
  line?: number;
}

export class ArchitectureValidator {
  private project: Project;
  private violations: ArchitectureViolation[] = [];

  constructor(tsConfigFilePath: string) {
    this.project = new Project({
      tsConfigFilePath,
      skipAddingFilesFromTsConfig: false,
    });
  }

  public validate(): ArchitectureViolation[] {
    this.violations = [];
    const sourceFiles = this.project.getSourceFiles();

    for (const file of sourceFiles) {
      if (this.isTestFile(file) || this.isNextJsConfig(file)) continue;

      this.checkLayerViolations(file);
      this.checkInfrastructureLeaks(file);
      this.checkRepositoryBypass(file);
    }

    this.checkCircularDependencies();

    return this.violations;
  }

  private isTestFile(file: SourceFile): boolean {
    const filePath = file.getFilePath();
    return filePath.includes('/testing/') || filePath.endsWith('.test.ts') || filePath.endsWith('.test.tsx');
  }

  private isNextJsConfig(file: SourceFile): boolean {
    const filePath = file.getFilePath();
    return filePath.endsWith('next.config.ts') || filePath.endsWith('tailwind.config.ts') || filePath.endsWith('vitest.config.ts');
  }

  private checkLayerViolations(file: SourceFile) {
    const filePath = file.getFilePath();
    
    // Business domains cannot import infrastructure directly, except for explicitly allowed abstractions
    if (filePath.includes('/lib/content/') || filePath.includes('/lib/iam/') || filePath.includes('/lib/campaign/') || filePath.includes('/lib/seo/') || filePath.includes('/lib/translation/')) {
      const imports = file.getImportDeclarations();
      for (const importDecl of imports) {
        const moduleSpecifier = importDecl.getModuleSpecifierValue();
        if (moduleSpecifier.includes('lib/infrastructure/')) {
          // Exceptions: RuntimeContext, Observability, RepositoryResolver
          if (!moduleSpecifier.includes('RuntimeContext') && 
              !moduleSpecifier.includes('observability') && 
              !moduleSpecifier.includes('RepositoryResolver') &&
              !moduleSpecifier.includes('deployment') &&
              !moduleSpecifier.includes('types')) {
            this.violations.push({
              file: filePath,
              rule: 'Layer Violation',
              message: `Business domain imports infrastructure directly: ${moduleSpecifier}`,
              line: importDecl.getStartLineNumber(),
            });
          }
        }
      }
    }
  }

  private checkInfrastructureLeaks(file: SourceFile) {
    const filePath = file.getFilePath();
    
    // Ensure no 'fs', 'console', or env access in business domains
    if (filePath.includes('/lib/content/') || filePath.includes('/lib/iam/') || filePath.includes('/lib/campaign/') || filePath.includes('/lib/seo/')) {
      const imports = file.getImportDeclarations();
      for (const importDecl of imports) {
        const moduleSpecifier = importDecl.getModuleSpecifierValue();
        if (moduleSpecifier === 'fs' || moduleSpecifier.startsWith('fs/')) {
          this.violations.push({
            file: filePath,
            rule: 'Infrastructure Leak',
            message: `Business domain imports native 'fs' module`,
            line: importDecl.getStartLineNumber(),
          });
        }
      }

      // Check for raw console.log (basic check)
      const text = file.getText();
      if (text.includes('console.log') || text.includes('console.error') || text.includes('console.warn')) {
         this.violations.push({
            file: filePath,
            rule: 'Infrastructure Leak',
            message: `Business domain uses native console API instead of Observability Logger`,
          });
      }
      
      // Check for raw process.env access
      if (text.includes('process.env')) {
         this.violations.push({
            file: filePath,
            rule: 'Infrastructure Leak',
            message: `Business domain accesses process.env directly instead of configuration service`,
          });
      }
    }
  }

  private checkRepositoryBypass(file: SourceFile) {
    const filePath = file.getFilePath();
    
    if (filePath.includes('/lib/content/') || filePath.includes('/lib/iam/')) {
      const imports = file.getImportDeclarations();
      for (const importDecl of imports) {
        const moduleSpecifier = importDecl.getModuleSpecifierValue();
        // Repositories must be resolved via RepositoryResolver, not imported as concrete classes
        if (moduleSpecifier.includes('Repository') && !moduleSpecifier.includes('IRepository') && !moduleSpecifier.includes('RepositoryResolver') && !moduleSpecifier.includes('/repositories/I')) {
          // Check if it's importing a concrete repository implementation
          const namedImports = importDecl.getNamedImports().map(i => i.getName());
          const hasConcreteRepo = namedImports.some(name => name.endsWith('Repository') && !name.startsWith('I') && name !== 'RepositoryResolver');
          
          if (hasConcreteRepo) {
            this.violations.push({
              file: filePath,
              rule: 'Repository Bypass',
              message: `Concrete repository imported directly: ${moduleSpecifier}. Use RepositoryResolver.`,
              line: importDecl.getStartLineNumber(),
            });
          }
        }
      }
    }
  }

  private checkCircularDependencies() {
    // A simple directed graph checker for circular dependencies
    // To be implemented using dependency-cruiser or ts-morph's getReferencingSourceFiles
  }
}
