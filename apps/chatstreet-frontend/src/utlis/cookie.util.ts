const getCookieByName = (cookie: string): string => {
  const value = document.cookie;
  const cookiePairs = value.split('; ');
  return cookiePairs.find((pair: string) => pair.startsWith(cookie))?.split('=')[1] ?? '';
};

// TODO: Implement
const setCookie = (name: string, value: string): boolean => false;

const clearAllCookies = () => {
  const Cookies = document.cookie.split(';');
  for (let i = 0; i < Cookies.length; i += 1) {
    document.cookie = `${Cookies[i]}=; expires=${new Date(0).toUTCString()}`;
  }
};

export { getCookieByName, setCookie, clearAllCookies };
