// Prefix a site path with the base path, so links work both on
// tangobuilds.github.io/Tangobuilds.com/ and on the root of tangobuilds.com.
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.replace(/^\//, '');
  return `${base}/${clean}`;
}
