# YouVersion Suggest for Chrome

*Copyright 2017 Caleb Evans*  
*Released under the MIT license*

YouVersion Suggest for Chrome is a Chrome extension based on the Bible-searching
Alfred workflow, [YouVersion Suggest][yvs].

This project is in its very early stages of development, so expect functionality
to be missing and incomplete.

[yvs]: https://github.com/caleb531/youversion-suggest

## Development Setup

### 1. Install local dependencies

```
npm install -g grunt
npm install
```

### 2. Download Bible data

```
git submodule update --init --recursive
```

### 3. Build extension

```
grunt serve
```

### 4. Load into Chrome

1. Click the **Window** menu and choose **Extensions**
2. Check the **Developer Mode** checkbox at the top of the page
3. Click the **Load unpacked extension...** button to the left
4. Choose your local project's `dist/` directory from the navigator prompt

## Disclaimer

This project is not affiliated with YouVersion, and all Bible content is
copyright of the respective publishers.
