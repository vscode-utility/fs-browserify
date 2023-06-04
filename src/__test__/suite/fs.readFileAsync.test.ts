import assert from 'assert';
import { posix } from 'path';
import { Uri, workspace } from 'vscode';
import { fs } from '../..';

suite('fs.readFileAsync', () => {
    let root: Uri;
    let file: Uri;
    suiteSetup(function () {
        root = workspace.workspaceFolders![0]!.uri;
        file = root.with({ path: posix.join(root.path, 'readFileAsync.txt') });
    });

    test('fs.readFileAsync - read content of file', async function () {
        // Setup test
        const fileContent = 'Laboriosam ducimus optio. Rerum unde ut non voluptas qui odio nostrum.';
        await fs.writeFileAsync(file, fileContent);

        // Run test
        const contents = await fs.readFileAsync(file);

        // Assert test
        assert.strictEqual(contents, fileContent);

        // Clean test
        await fs.deleteAsync(file, { recursive: true, useTrash: false });
    });
});
