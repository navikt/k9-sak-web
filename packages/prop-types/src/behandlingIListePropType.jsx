import PropTypes from 'prop-types';

const behandlingIListePropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  fagsakId: PropTypes.number.isRequired,
  opprettet: PropTypes.string.isRequired,
  avsluttet: PropTypes.string,
  endret: PropTypes.string,
  behandlendeEnhetId: PropTypes.string.isRequired,
  behandlendeEnhetNavn: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      rel: PropTypes.string.isRequired,
      requestPayload: PropTypes.shape({}),
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
  gjeldendeVedtak: PropTypes.bool,
});

export default behandlingIListePropType;
