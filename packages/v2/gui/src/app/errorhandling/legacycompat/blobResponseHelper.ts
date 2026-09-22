import { AxiosError } from 'axios';

export const isOfTypeBlob = (error: AxiosError): boolean => error.config?.responseType === 'blob';

export const blobToText = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onerror = () => {
      fileReader.abort();
      reject(new Error('Problem parsing blob'));
    };
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') {
        resolve(fileReader.result);
      } else {
        reject(new Error('Problem parsing blob'));
      }
    };
    fileReader.readAsText(blob);
  });
