import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: 'en',
  
  // Always use the locale prefix
  localePrefix: 'always'
});

export const config = {
  // Match all pathnames except for:
  // - API routes
  // - Next.js internals
  // - Static files (e.g. favicon.ico)
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
