const CLIENT_HOME_PATH = '/dashboard/workspace';

export function resolveClientHomePath(
  path: null | string | undefined,
): string {
  if (!path) {
    return CLIENT_HOME_PATH;
  }

  const decodedPath = decodeURIComponent(path);
  return decodedPath === '/home' ||
    decodedPath === '/client' ||
    decodedPath === '/client/home'
    ? CLIENT_HOME_PATH
    : decodedPath;
}
