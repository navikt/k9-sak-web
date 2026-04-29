class ErrorMessage {
  text: string;

  extra?: Record<string, string>;

  static withMessage(message: string, extra?: Record<string, string>) {
    const errorMessage = new ErrorMessage();
    errorMessage.text = message;
    errorMessage.extra = extra;
    return errorMessage;
  }
}

export default ErrorMessage;
