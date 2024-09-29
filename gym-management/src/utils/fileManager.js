// utils/fileManager.js
export const openFile = async () => {
    const [fileHandle] = await window.showOpenFilePicker({
      types: [
        {
          description: 'JSON Files',
          accept: { 'application/json': ['.json'] },
        },
      ],
    });
    return fileHandle;
  };
  
  export const readFile = async (fileHandle) => {
    const file = await fileHandle.getFile();
    const contents = await file.text();
    return JSON.parse(contents);
  };
  
  export const saveFile = async (fileHandle, data) => {
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(data, null, 2));
    await writable.close();
  };
  