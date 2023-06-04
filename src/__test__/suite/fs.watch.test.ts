import { Uri, workspace } from 'vscode';

suite('fs.watch', () => {
    let root: Uri;
    suiteSetup(function () {
        root = workspace.workspaceFolders![0]!.uri;
    });

    test('fs.watch', async function () {
        // TODO: under development
    });
});
