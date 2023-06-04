import assert from 'assert';
import { posix } from 'path';
import { Uri, workspace } from 'vscode';
import { fs } from '../..';

suite('fs.renameAsync', () => {
    let root: Uri;
    let folder: Uri;
    let file: Uri;
    suiteSetup(function () {
        root = workspace.workspaceFolders![0]!.uri;
        folder = root.with({ path: posix.join(root.path, 'source/rename') });
        file = root.with({ path: posix.join(root.path, 'source/rename/renameAsync.txt') });
    });

    test('fs.renameAsync - succeed unexpectedly', async function () {
        // Setup test
        await fs.createDirectoryAsync(folder);

        const targetFolder = root.with({ path: posix.join(root.path, 'target/rename') });
        try {
            // Run test
            await fs.renameAsync(folder, targetFolder, { overwrite: true });
            assert.ok(true);
        } catch (err) {
            assert.ok(false, err as Error);
        } finally {
            // Clean test
            await fs.deleteAsync(targetFolder, { recursive: true, useTrash: false });
        }
    });
});
