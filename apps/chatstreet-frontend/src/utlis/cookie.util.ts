const getCookieByName = (cookie: string): string => {
  const value = document.cookie;
  const cookiePairs = value.split('; ');
  return cookiePairs.find((pair: string) => pair.startsWith(cookie))?.split('=')[1] ?? '';
};

// TODO: Implement
const setCookie = (name: string, value: string): boolean => false;

export { getCookieByName, setCookie };
