type ReadImageFileCallbackType = (content: string) => void;

const readImageFile = (file: any, callback: ReadImageFileCallbackType) => {
  const reader = new FileReader();
  reader.onload = () => {
    callback(reader.result?.toString() ?? '');
  };
  reader.readAsBinaryString(file);
};

export { ReadImageFileCallbackType, readImageFile };
