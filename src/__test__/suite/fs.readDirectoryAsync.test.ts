import assert from 'assert';
import { Uri, workspace } from 'vscode';
import { fs } from '../..';

suite('fs.readDirectoryAsync', () => {
    let root: Uri;
    suiteSetup(function () {
        root = workspace.workspaceFolders![0]!.uri;
    });

    test('fs.readDirectoryAsync', async function () {
        const entries = await fs.readDirectoryAsync(root);
        assert.ok(entries.length > 0);
    });
});
