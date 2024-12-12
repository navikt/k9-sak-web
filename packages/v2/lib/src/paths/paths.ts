export const getPathToK9Los = (): string | null => {
  const { host } = window.location;
  if (host === 'app-q1.adeo.no' || host === 'k9.dev.intern.nav.no') {
    return 'https://k9-los-web.intern.dev.nav.no';
  }
  if (host === 'app.adeo.no' || host === 'k9.intern.nav.no') {
    return 'https://k9-los-web.intern.nav.no';
  }
  return null;
};

export const goToLos = () => {
  const path = getPathToK9Los();
  if (path) {
    window.location.assign(path);
  }
};
