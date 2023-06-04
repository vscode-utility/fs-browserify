import assert from 'assert';
import { FileSystemError, FileType, Uri, workspace } from 'vscode';
import { fs } from '../..';

suite('fs.statAsync', () => {
    let root: Uri;

    suiteSetup(function () {
        root = workspace.workspaceFolders![0]!.uri;
    });

    test('fs.statAsync - good scheme', async function () {
        const stat = await fs.statAsync(root);
        assert.strictEqual(stat.type, FileType.Directory);
        assert.strictEqual(typeof stat.size, 'number');
        assert.strictEqual(typeof stat.mtime, 'number');
        assert.strictEqual(typeof stat.ctime, 'number');
        assert.ok(stat.mtime > 0);
        assert.ok(stat.ctime > 0);
    });

    test('fs.statAsync - bad scheme', async function () {
        try {
            await fs.statAsync('foo:/bar/baz/test.txt');
            assert.ok(false);
        } catch (e) {
            assert.ok(true);
            assert.ok(e instanceof FileSystemError);
        }
    });

    test('fs.statAsync - file not found', async function () {
        try {
            await fs.statAsync(`/florida/project/awesome.tx6`);
            assert.ok(false);
        } catch (e) {
            assert.ok(true);
            assert.ok(e instanceof FileSystemError);
            assert.strictEqual(e.name, FileSystemError.FileNotFound().name);
        }
    });
});
