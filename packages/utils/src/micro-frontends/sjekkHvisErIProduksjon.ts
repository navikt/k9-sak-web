const sjekkHvisErIProduksjon = () => {
  const { host } = window.location;
  return host === 'app.adeo.no';
};
export default sjekkHvisErIProduksjon;

export const hentURLTilILivetsSluttfase = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8182';
  }
  return process.env.PLEIEPENGER_I_LIVETS_SLUTTFASE_URL;
};


