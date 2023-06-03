[![CI](https://github.com/nguyenngoclongdev/vscode-fs-browserify/actions/workflows/ci.yml/badge.svg)](https://github.com/nguyenngoclongdev/vscode-fs-browserify/actions/workflows/ci.yml)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/nguyenngoclongdev/vscode-fs-browserify/)

# @vscode-utility/fs-browserify

When developing vscode extensions, it is essential to ensure compatibility between the desktop and web versions of vscode (https://vscode.dev or https://github.dev). One way to achieve this is by using the `@vscode-utility/fs-browserify` package.

Using this package, you can access and manipulate files stored locally or remotely, making it easier to develop vscode extensions that work seamlessly on both the desktop and web versions of vscode. For instance, you can use fs.readDirectoryAsync(path) to retrieve all entries in a directory, and fs.statAsync(path) to obtain the metadata of a file.

Overall, incorporating the `@vscode-utility/fs-browserify` package in your vscode extension development workflow can help you achieve full compatibility and enhance the user experience across different vscode platforms.

This package is maintained by the [Nguyen Ngoc Long](https://github.com/nguyenngoclongdev/).

You can find latest release in the [NPM](https://www.npmjs.com/@vscode-utility/fs-browserify)

## Usage

```typescript
import { fs } from '@vscode-utility/fs-browserify';

const fileStat = await fs.statAsync(path);
console.log(fileStat);

const fileContent = await fs.readFileAsync(path);
console.log(fileContent);
```

## Compare functions

| @vscode-utility/fs-browserify | fs (nodejs)     |
| ----------------------------- | --------------- |
| fs.statAsync()                | fs.stat()       |
| fs.readDirectoryAsync()       | fs.readDir()    |
| fs.createDirectoryAsync()     | fs.mkdir()      |
| fs.readFileAsync()            | fs.readFile()   |
| fs.appendFileAsync()          | fs.appendFile() |
| fs.writeFileAsync()           | fs.writeFile()  |
| fs.deleteAsync()              | fs.rmdir()      |
| fs.renameAsync()              | fs.rename()     |
| fs.copyAsync()                | fs.cp()         |
| fs.existAsync()               | fs.exist()      |
| fs.truncateAsync()            | fs.truncate()   |

## Feedback

If you discover a bug, or have a suggestion for a feature request, please
submit an [issue](https://github.com/nguyenngoclongdev/vscode-fs-browserify/issues).

## LICENSE

This extension is licensed under the [MIT License](LICENSE)
