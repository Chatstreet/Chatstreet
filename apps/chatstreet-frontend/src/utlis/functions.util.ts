type ReadImageFileCallbackType = (content: string) => void;

const readImageFile = (file: any, callback: ReadImageFileCallbackType) => {
  const reader = new FileReader();
  reader.onload = () => {
    callback(reader.result?.toString() ?? '');
  };
  reader.readAsBinaryString(file);
};

const kebabize = (name: string): string => name.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $);

const validUser = (str: string): boolean => /^[A-Za-z]+#\d{4}$/.test(str);

const validUsername = (str: string) => /^[^#]*$/.test(str);

const validEmailAddress = (str: string) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(str);

export {
  ReadImageFileCallbackType,
  readImageFile,
  kebabize,
  validUser,
  validUsername,
  validEmailAddress,
};
