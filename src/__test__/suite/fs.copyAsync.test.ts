import assert from 'assert';
import { posix } from 'path';
import { Uri, workspace } from 'vscode';
import { fs } from '../..';

suite('fs.copyAsync', () => {
    let root: Uri;
    let folder: Uri;
    let file: Uri;
    suiteSetup(function () {
        root = workspace.workspaceFolders![0]!.uri;
        folder = root.with({ path: posix.join(root.path, 'source/copy') });
        file = root.with({ path: posix.join(root.path, 'source/copy/copyAsync.txt') });
    });

    test('fs.copyAsync - succeed unexpectedly', async function () {
        // Setup test
        const targetFolder = root.with({ path: posix.join(root.path, 'target/copy') });
        const fileContent = 'Eum est blanditiis. Ea iusto debitis fugit dolorem amet.';
        await fs.createDirectoryAsync(folder);
        await fs.writeFileAsync(file, fileContent);

        try {
            // Run test
            await fs.copyAsync(folder, targetFolder, { overwrite: true });
            assert.ok(true);

            // Assert test
            const targetFile = targetFolder.with({ path: posix.join(targetFolder.path, 'copyAsync.txt') });
            const output = await fs.readFileAsync(targetFile);
            assert.strictEqual(output, fileContent);
        } catch (err) {
            assert.ok(false, err as Error);
        } finally {
            // Clean test
            await fs.deleteAsync(folder, { recursive: true, useTrash: false });
            await fs.deleteAsync(targetFolder, { recursive: true, useTrash: false });
        }
    });
});
