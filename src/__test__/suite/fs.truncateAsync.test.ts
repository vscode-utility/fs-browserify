import { Uri, workspace } from 'vscode';

suite('fs.truncateAsync', () => {
    let root: Uri;
    suiteSetup(function () {
        root = workspace.workspaceFolders![0]!.uri;
    });

    test('fs.truncateAsync', async function () {
        // TODO: under development
    });
});
