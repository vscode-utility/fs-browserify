import assert from 'assert';
import { posix } from 'path';
import { Uri, workspace } from 'vscode';
import { fs } from '../..';

suite('fs.deleteAsync', () => {
    let root: Uri;
    suiteSetup(function () {
        root = workspace.workspaceFolders![0]!.uri;
    });

    test('fs.deleteAsync file', async function () {
        // Setup test
        const uri = root.with({ path: posix.join(root.path, 'deleteAsync.file') });
        await fs.writeFileAsync(uri, 'Magnam id quia ut eveniet.');

        // Run test
        await fs.deleteAsync(uri);

        // Assert test
        try {
            await fs.statAsync(uri);
            assert.ok(false);
        } catch {
            assert.ok(true);
        }
    });

    test('fs.deleteAsync folder', async function () {
        // Setup test
        const folder = root.with({ path: posix.join(root.path, 'folder') });
        const file = root.with({ path: posix.join(root.path, 'folder/file') });
        await fs.createDirectoryAsync(folder);
        await fs.writeFileAsync(file, 'Aut tempore eaque ut id occaecati ut modi perferendis temporibus.');
        await fs.statAsync(folder);
        await fs.statAsync(file);

        // Esure non empty folder cannot be deleted
        try {
            await fs.deleteAsync(folder, { recursive: false, useTrash: false });
            assert.ok(false);
        } catch {
            await fs.statAsync(folder);
            await fs.statAsync(file);
        }

        // Ensure non empty folder cannot be deleted is DEFAULT
        try {
            await fs.deleteAsync(folder); // recursive: false as default
            assert.ok(false);
        } catch {
            await fs.statAsync(folder);
            await fs.statAsync(file);
        }

        // Delete non empty folder with recursive-flag
        await fs.deleteAsync(folder, { recursive: true, useTrash: false });

        // Esnure folder/file are gone
        try {
            await fs.statAsync(folder);
            assert.ok(false);
        } catch {
            assert.ok(true);
        }
        try {
            await fs.statAsync(file);
            assert.ok(false);
        } catch {
            assert.ok(true);
        }
    });

    test('fs.deleteAsync - succeed unexpectedly', async function () {
        const entries = await fs.readDirectoryAsync(root);
        assert.ok(entries.length > 0);

        const targetFolder = root.with({ path: posix.join(root.path, 'eius') });
        try {
            await fs.deleteAsync(targetFolder, { recursive: true });
            assert.ok(false);
        } catch (err) {
            assert.ok(true);
        } finally {
            // Clean test
            const isExist = await fs.existAsync(targetFolder);
            if (isExist) {
                await fs.deleteAsync(targetFolder, { recursive: true, useTrash: false });
            }
        }
    });
});
