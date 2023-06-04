import assert from 'assert';
import { posix } from 'path';
import { Uri, workspace } from 'vscode';
import { fs } from '../..';

suite('fs.writeFileAsync', () => {
    let root: Uri;
    let file: Uri;
    suiteSetup(function () {
        root = workspace.workspaceFolders![0]!.uri;
        file = root.with({ path: posix.join(root.path, 'writeFileAsync.txt') });
    });

    test('fs.writeFileAsync', async function () {
        // Run test
        const fileContent = 'Veniam velit non quod ea placeat culpa excepturi ab.';
        await fs.writeFileAsync(file, fileContent);

        // Assert test
        const contents = await fs.readFileAsync(file);
        assert.strictEqual(contents, fileContent);

        // Clean test
        await fs.deleteAsync(file, { recursive: true, useTrash: false });
    });
});
