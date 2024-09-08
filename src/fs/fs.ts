import {
    readFile as fsReadFile,
    readFileSync as fsReadFileSync,
    writeFile as fsWriteFile,
    writeFileSync as fsWriteFileSync,
    PathLike
} from 'fs';
import jsonfile from 'jsonfile';
import { Url } from 'url';
import { FileStat, FileSystemWatcher, FileType, Uri, workspace } from 'vscode';
import { FileAccess } from '.';

const { fs: wfs, createFileSystemWatcher } = workspace;

/**
 * The file system interface allows extensions to manipulate both local and remote files,
 * using the editor's built-in and contributed FileSystemProvider for accessing FTP servers or a remote extension host.
 */
export class FileSystem {
    /**
     * Retrieve the Uri of the file.
     *
     * @param path The file path for which to retrieve metadata.
     * @return The Uri about the file.
     */
    private getUri = (path: string | Uri): Uri => {
        if (path instanceof Uri) {
            return path;
        }
        return Uri.file(path);
    };

    /**
     * Retrieve the byte content of the file.
     *
     * @param path The file path for which to retrieve byte content.
     * @return The byte content of the file.
     */
    private getContentBytes = (content: string | Uint8Array): Uint8Array => {
        if (content instanceof Uint8Array) {
            return content;
        }

        const encoder = new TextEncoder();
        return encoder.encode(content);
    };

    /**
     * Retrieve file metadata.
     *
     * @param path The file path for which to retrieve metadata.
     * @return The metadata of the file.
     */
    statAsync = async (path: string | Uri): Promise<FileStat> => {
        const uri = this.getUri(path);
        return await wfs.stat(uri);
    };

    /**
     * Retrieve all directory entries.
     *
     * @param path The folder path.
     * @return An array of name and type tuples, or a thenable that resolves to such an array.
     */
    readDirectoryAsync = async (path: string | Uri): Promise<[string, FileType][]> => {
        const uri = this.getUri(path);
        return await wfs.readDirectory(uri);
    };

    /**
     * Create a new directory.
     *
     * @param path The path for the new folder.
     */
    createDirectoryAsync = async (path: string | Uri): Promise<void> => {
        const uri = this.getUri(path);
        await wfs.createDirectory(uri);
    };

    /**
     * Read the full content of a file.
     *
     * @param path The file path.
     * @param options Specifies whether to choose file encodings, include byte order mark, and throw a TypeError in case of decoding errors.
     * @return The content of the file.
     */
    readFileAsync = async (
        path: string | Uri,
        options?: {
            encoding?: string;
            fatal?: boolean | undefined;
            ignoreBOM?: boolean | undefined;
        }
    ): Promise<string> => {
        const uri = this.getUri(path);
        const content = await wfs.readFile(uri);

        const { encoding = 'utf-8', fatal, ignoreBOM } = options || {};
        const decoder = new TextDecoder(encoding, { fatal, ignoreBOM });
        return decoder.decode(content);
    };

    /**
     * Reads a JSON file and then parses it into an object.
     *
     * @param path The file path.
     * @param {Object} options Pass in any [fs.readFile](https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback) options or set reviver for a [JSON reviver](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse).
     * @param {Object} options.throws (boolean, default: true). If JSON.parse throws an error, pass this error to the callback. If false, returns null for the object.
     * @return The json object.
     */
    readJsonAsync = async <T>(
        path: PathLike | Url,
        options?: {
            encoding?: string;
            flag?: string;
            throws?: boolean;
            fs?: {
                readFile: typeof fsReadFile;
                readFileSync: typeof fsReadFileSync;
                writeFile: typeof fsWriteFile;
                writeFileSync: typeof fsWriteFileSync;
            };
            reviver?: (key: any, value: any) => any;
        }
    ): Promise<T> => {
        return await jsonfile.readFile(path, options);
    };

    /**
     * Append the provided data to a file. If the file does not exist, a new one is created.
     *
     * @param path The file path.
     * @param content The new content of the file.
     */
    appendFileAsync = async (path: string | Uri, content: string | Uint8Array): Promise<void> => {
        const uri = this.getUri(path);
        let existingContentBytes: Uint8Array = new Uint8Array(0);
        if (await this.existAsync(uri)) {
            existingContentBytes = await wfs.readFile(uri);
        }

        const contentBytes = this.getContentBytes(content);
        const updatedContent = new Uint8Array(existingContentBytes.length + contentBytes.length);
        updatedContent.set(existingContentBytes, 0);
        updatedContent.set(contentBytes, existingContentBytes.length);
        await wfs.writeFile(uri, updatedContent);
    };

    /**
     * Write data to a file and replace its full contents.
     *
     * @param path The file path.
     * @param content The new content of the file.
     */
    writeFileAsync = async (path: string | Uri, content: string | Uint8Array): Promise<void> => {
        const uri = this.getUri(path);
        const contentBytes = this.getContentBytes(content);
        await wfs.writeFile(uri, contentBytes);
    };

    /**
     * Writes an object to a JSON file.
     *
     * @param path The file path.
     * @param content The json content.
     * @param {Object} options Specifield option to write json (also accepts [fs.writeFile() options](https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback))
     * @param {Object} options.spaces Number of spaces to indent; or a string to use for indentation (i.e. pass '\t' for tab indentation).
     * @param {Object} options.EOL Set EOL character. Default is \n.
     * @param {Object} options.finalEOL Set to save the file with EOL at the end. Default is true.
     * @param {Object} options.replacer [JSON Replacer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#The_replacer_parameter)
     */
    writeJsonAsync = async (
        path: PathLike | Url,
        content: any,
        options?: {
            encoding?: string;
            mode?: string;
            flag?: string;
            fs?: {
                readFile: typeof fsReadFile;
                readFileSync: typeof fsReadFileSync;
                writeFile: typeof fsWriteFile;
                writeFileSync: typeof fsWriteFileSync;
            };
            // eslint-disable-next-line @typescript-eslint/naming-convention
            EOL?: string;
            finalEOL?: boolean;
            spaces?: string;
            replacer?: (key: string, value: any) => any;
        }
    ): Promise<void> => {
        await jsonfile.writeFile(path, content, options);
    };

    /**
     * Delete a file.
     *
     * @param path The path of the file or directory to be deleted.
     * @param options Determines whether to use the trash can and whether folder deletion is recursive.
     */
    deleteAsync = async (path: string | Uri, options?: { recursive?: boolean; useTrash?: boolean }): Promise<void> => {
        const uri = this.getUri(path);
        await wfs.delete(uri, options);
    };

    /**
     * Rename a file or folder.
     *
     * @param source The existing file.
     * @param target The new location.
     * @param options Defines if existing files should be overwritten.
     */
    renameAsync = async (source: string | Uri, target: Uri, options?: { overwrite?: boolean }): Promise<void> => {
        const sourceUri = this.getUri(source);
        const targetUri = this.getUri(target);
        await wfs.rename(sourceUri, targetUri, options);
    };

    /**
     * Copy files or folders.
     *
     * @param source The existing file.
     * @param target The destination location.
     * @param options Defines if existing files should be overwritten.
     */
    copyAsync = async (source: Uri, target: Uri, options?: { overwrite?: boolean }): Promise<void> => {
        const sourceUri = this.getUri(source);
        const targetUri = this.getUri(target);
        await wfs.copy(sourceUri, targetUri, options);
    };

    /**
     * Check if a given file system supports writing files.
     *
     * @param scheme The file system scheme, such as file or git.
     * @return `true` if the file system supports writing, `false` if it is read-only, and undefined if the editor is unaware of the file system.
     */
    isWritableFileSystem = (scheme: string): boolean | undefined => {
        return wfs.isWritableFileSystem(scheme);
    };

    /**
     * Check if a given path exists or not in the file system.
     *
     * @param path The path at which directory is to be tested for existence.
     * @return `true` if the path exists; otherwise `false`.
     */
    existAsync = async (path: string | Uri): Promise<boolean> => {
        try {
            const uri = this.getUri(path);
            await wfs.stat(uri);
            return true;
        } catch {
            return false;
        }
    };

    /**
     * Truncates the file to change the size of the file i.e either increase or decrease the file size.
     *
     * @param path The path of the target file.
     * @param length The file length for truncation, with an optional integer input. If not specified, the default value is 0.
     */
    truncateAsync = async (path: string | Uri, length: number = 0) => {
        try {
            // Read file content
            const uri = this.getUri(path);
            const content = await this.readFileAsync(uri);

            // Re-write the content
            const truncatedContent = content.slice(0, length);
            await this.writeFileAsync(uri, truncatedContent);
        } catch (err) {
            console.error(err);
        }
    };

    /**
     * Watch the specified file for changes continuously.
     *
     * @param pattern A pattern expressed in glob syntax that is used to match the absolute paths of files that have been created, changed, or deleted.
     * @param ignoreCreateEvents Ignore when files have been created.
     * @param ignoreChangeEvents Ignore when files have been changed.
     * @param ignoreDeleteEvents Ignore when files have been deleted.
     * @return A new file system watcher instance.
     */
    watch = (
        pattern: string,
        options?: {
            ignoreCreateEvents?: boolean;
            ignoreChangeEvents?: boolean;
            ignoreDeleteEvents?: boolean;
        }
    ): FileSystemWatcher => {
        const { ignoreCreateEvents = false, ignoreChangeEvents = false, ignoreDeleteEvents = false } = options || {};
        return createFileSystemWatcher(pattern, ignoreCreateEvents, ignoreChangeEvents, ignoreDeleteEvents);
    };

    /**
     * Check the permissions of a given file
     *
     * @param path The path of the file.
     * @return `FileAccess.Write` if the file system supports writing, `FileAccess.Read` if it is read-only, and `FileAccess.None` if the editor is unaware of the file system.
     */
    access = (path: string | Uri): FileAccess => {
        const uri = this.getUri(path);
        const isWritable = this.isWritableFileSystem(uri.scheme);
        if (isWritable === undefined) {
            return FileAccess.None;
        }
        return isWritable ? FileAccess.Write : FileAccess.Read;
    };
}
