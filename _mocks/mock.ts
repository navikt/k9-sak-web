import querystring from 'querystring';
import axios from 'axios';
import featureToggles from './featureToggles';

const vtpAccessTokenUrl = 'http://localhost:8060/rest/isso/oauth2/access_token';

export default () => [
  {
    url: '/k9/feature-toggle/toggles.json',
    response: () => featureToggles,
  },
  {
    url: '/login-with-vtp',
    rawResponse: async (req, res) => {
      const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      const roles = ['beslut', 'klageb', 'oversty', 'saksbeh', 'saksbeh6', 'saksbeh7', 'veil'];
      const urls = {};
      roles.forEach(role => {
        const url = new URL(`${fullUrl}redirect`);
        url.searchParams.append('code', role);
        urls[role] = url.toString();
      });
      res.json(urls);
    },
  },
  {
    url: '/login-with-vtp/redirect',
    rawResponse: async (req, res) => {
      const redirectUri = req.query.redirect_uri ? req.query.redirect_uri : '/';
      axios
        .post(
          vtpAccessTokenUrl,
          querystring.stringify({
            grant_type: 'code',
            code: req.query.code,
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        )
        .then(result => {
          res.cookie('ID_token', result.data.id_token, {
            maxAge: 86400000,
            httpOnly: true,
          });
          res.redirect(redirectUri);
        });
    },
  },
];
