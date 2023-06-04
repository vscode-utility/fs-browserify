import { ExtensionContext } from 'vscode';

export function activate(_context: ExtensionContext) {
    // Set context as a global as some tests depend on it
    (global as any).testExtensionContext = _context;
}
