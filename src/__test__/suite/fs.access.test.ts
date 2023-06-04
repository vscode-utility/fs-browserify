import { Uri, workspace } from 'vscode';

suite('fs.access', () => {
    let root: Uri;
    suiteSetup(function () {
        root = workspace.workspaceFolders![0]!.uri;
    });

    test('fs.access', async function () {
        // TODO: under development
    });
});
