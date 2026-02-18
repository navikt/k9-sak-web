import ErrorMessage from './ErrorMessage';

interface Formatter<T> {
  isOfType(type: string): boolean;
  format(errorData: T): ErrorMessage | undefined;
}

export default Formatter;
