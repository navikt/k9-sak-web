import PropTypes from 'prop-types';

const personopplysningPropType = PropTypes.shape({
  nummer: PropTypes.number,
  navBrukerKjonn: PropTypes.string.isRequired,
  statsborgerskap: PropTypes.string.isRequired,
  avklartPersonstatus: PropTypes.shape({
    orginalPersonstatus: PropTypes.string.isRequired,
    overstyrtPersonstatus: PropTypes.string.isRequired,
  }),
  personstatus: PropTypes.string.isRequired,
  diskresjonskode: PropTypes.string.isRequired,
  sivilstand: PropTypes.string.isRequired,
  aktoerId: PropTypes.string.isRequired,
  navn: PropTypes.string.isRequired,
  dodsdato: PropTypes.string,
  fodselsdato: PropTypes.string,
  adresser: PropTypes.arrayOf(PropTypes.shape({
    adresseType: PropTypes.string.isRequired,
    adresselinje1: PropTypes.string,
    adresselinje2: PropTypes.string,
    adresselinje3: PropTypes.string,
    postNummer: PropTypes.string,
    poststed: PropTypes.string,
    land: PropTypes.string,
    mottakerNavn: PropTypes.string,

  })),
  fnr: PropTypes.string,
  region: PropTypes.string.isRequired,
  annenPart: PropTypes.shape(),
  barn: PropTypes.arrayOf(PropTypes.shape()),
  harVerge: PropTypes.bool,
  barnSoktFor: PropTypes.arrayOf(PropTypes.shape()),
  barnFraTpsRelatertTilSoknad: PropTypes.arrayOf(PropTypes.shape()),
});

export default personopplysningPropType;
