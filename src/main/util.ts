import { app } from 'electron';
import path from 'path';
import { URL } from 'url';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export function getCommonPaths() {
  return {
    desktop: app.getPath('desktop'),
    downloads: app.getPath('downloads'),
    pictures: app.getPath('pictures'),
    // Add other paths as needed
  };
}
export type CommonPaths = ReturnType<typeof getCommonPaths>;
