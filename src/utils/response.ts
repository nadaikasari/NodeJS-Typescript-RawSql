import { HttpStatus } from './httpStatus';

interface ResponseData<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T | null;
}

export const createResponse = <T>(
  statusCode: number,
  success: boolean,
  message: string,
  data: T | null
): ResponseData<T> => {
  return {
    statusCode,
    success,
    message,
    data,
  };
};

export const createErrorResponse = (
  message: string,
  statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR
): ResponseData<null> => {
  return createResponse(statusCode, false, message, null);
};
