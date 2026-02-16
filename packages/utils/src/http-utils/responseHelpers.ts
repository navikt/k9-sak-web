import type { AxiosError } from 'axios';

export const isUnauthorized = statusCode => statusCode === 401;
export const isForbidden = statusCode => statusCode === 403;

export const httpErrorShouldBeHandledExternally = (error: AxiosError) => {
  if (error.response) {
    const { status } = error.response;
    return isForbidden(status) || isUnauthorized(status);
  }
  return false;
};

export const handleErrorExternally = (
  error: AxiosError,
  errorHandler: (statusCode: number, locationHeader?: string) => void,
) => {
  errorHandler(error.response?.status ?? 0, error.response?.headers.location);
};
