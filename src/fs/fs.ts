import { FileStat, FileType, Uri, workspace } from 'vscode';
const { fs: wfs } = workspace;

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
     * @param destination The destination location.
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
     * Truncates the file to change the size of the file i.e either increase or decrease the file size
     *
     * @param filePath This property contains the path of the target file, which can be either a string, buffer or URL.
     * @param length This property sets the file length for truncation, with an optional integer input. If not specified, the default value is 0.
     */
    truncateAsync = async (path: string | Uri, length: number) => {
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
}
