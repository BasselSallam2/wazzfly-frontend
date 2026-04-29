import Cookies from 'js-cookie';
import { TOKEN_COOKIE_DAYS, TOKEN_COOKIE_NAME } from '@/config/constants';

export const tokenStorage = {
  read(): string | undefined {
    return Cookies.get(TOKEN_COOKIE_NAME);
  },
  write(token: string): void {
    Cookies.set(TOKEN_COOKIE_NAME, token, {
      expires: TOKEN_COOKIE_DAYS,
      sameSite: 'Lax',
      secure: window.location.protocol === 'https:',
      path: '/',
    });
  },
  clear(): void {
    Cookies.remove(TOKEN_COOKIE_NAME, { path: '/' });
  },
};
