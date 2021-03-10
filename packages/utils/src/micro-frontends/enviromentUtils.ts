const sjekkHvisErIProduksjon = () => {
  const { host } = window.location;
  return host === 'app.adeo.no';
};

export default sjekkHvisErIProduksjon;
