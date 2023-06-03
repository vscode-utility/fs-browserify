import { FileSystem } from './fs';

/**
 * With a FileSystem instance, you can interact with files stored locally or remotely.
 * For example, use fs.readDirectory(path) to get all entries in a directory, and fs.stat(path) to obtain the metadata of a file.
 */
export const fs = new FileSystem();
