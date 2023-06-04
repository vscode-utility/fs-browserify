import assert from 'assert';
import { EOL } from 'os';
import { posix } from 'path';
import { FileType, Uri, workspace } from 'vscode';
import { fs } from '../..';

suite('fs.appendFileAsync', () => {
    let root: Uri;
    let file: Uri;
    suiteSetup(function () {
        root = workspace.workspaceFolders![0]!.uri;
        file = root.with({ path: posix.join(root.path, 'appendFileAsync.txt') });
    });

    test('fs.appendFileAsync', async function () {
        // Setup test
        const fileContent = 'Veniam velit non quod ea placeat culpa excepturi ab.';
        await fs.writeFileAsync(file, fileContent);

        // Run test
        const fileContentAppend = 'Voluptas dolores vitae. Ab voluptas ullam consequatur ipsam.';
        await fs.appendFileAsync(file, fileContentAppend);

        // Assert test
        const contents = await fs.readFileAsync(file);
        assert.strictEqual(contents, [fileContent, fileContentAppend].join(''));

        // Clean test
        await fs.deleteAsync(file, { recursive: true, useTrash: false });
    });
});
