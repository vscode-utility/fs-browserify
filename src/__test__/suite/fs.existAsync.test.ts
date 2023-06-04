import assert from 'assert';
import { posix } from 'path';
import { Uri, workspace } from 'vscode';
import { fs } from '../..';

suite('fs.existAsync', () => {
    let root: Uri;
    let file: Uri;
    suiteSetup(function () {
        root = workspace.workspaceFolders![0]!.uri;
        file = root.with({ path: posix.join(root.path, 'existAsync.txt') });
    });

    test('fs.createDirectoryAsync - create folder', async function () {
        // Create file
        await fs.writeFileAsync(file, 'Ullam dolore rerum repellat laudantium quo.');

        // Check file should be existed
        const isExist = await fs.existAsync(file);
        assert.strictEqual(isExist, true);

        // Clean test
        await fs.deleteAsync(file, { recursive: true, useTrash: false });
    });
});
