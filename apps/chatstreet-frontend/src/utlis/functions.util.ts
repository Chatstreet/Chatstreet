type ReadImageFileCallbackType = (content: string) => void;

const readImageFile = (file: any, callback: ReadImageFileCallbackType) => {
  const reader = new FileReader();
  reader.onload = () => {
    callback(reader.result?.toString() ?? '');
  };
  reader.readAsBinaryString(file);
};

const kebabize = (name: string) => name.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $);

export { ReadImageFileCallbackType, readImageFile, kebabize };
