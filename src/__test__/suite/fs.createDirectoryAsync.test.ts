import assert from 'assert';
import { posix } from 'path';
import { Uri, workspace } from 'vscode';
import { fs } from '../..';

suite('fs.createDirectoryAsync', () => {
    let root: Uri;
    let folder: Uri;
    let file: Uri;
    suiteSetup(function () {
        root = workspace.workspaceFolders![0]!.uri;
        folder = root.with({ path: posix.join(root.path, 'folder') });
        file = root.with({ path: posix.join(root.path, 'folder/file') });
    });

    test('fs.createDirectoryAsync - create folder', async function () {
        try {
            // Create folder and one file in a folder
            await fs.createDirectoryAsync(folder);
            await fs.writeFileAsync(file, 'Ullam dolore rerum repellat laudantium quo.');

            // Check file and folder is existed
            await fs.statAsync(folder);
            await fs.statAsync(file);
            assert.ok(true);
        } catch (err) {
            assert.ok(false, err as Error);
        } finally {
            // Clean test
            await fs.deleteAsync(folder, { recursive: true, useTrash: false });
        }
    });
});
