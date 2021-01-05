jest.spyOn(global.console, 'warn').mockImplementationOnce(message => {
  if (message.includes('Please use the peer or standalone build instead')) {
    global.console.warn(message);
  } else {
    throw new Error(message);
  }
});
