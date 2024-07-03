import PropTypes from 'prop-types';

const personopplysningPropType = PropTypes.shape({
  nummer: PropTypes.number,
  navBrukerKjonn: PropTypes.string.isRequired, // kodeverk
  statsborgerskap: PropTypes.string.isRequired, // kodeverk
  avklartPersonstatus: PropTypes.shape({
    orginalPersonstatus: PropTypes.string, // kodeverk
    overstyrtPersonstatus: PropTypes.string.isRequired, // kodeverk
  }),
  personstatus: PropTypes.string.isRequired, // kodeverk
  diskresjonskode: PropTypes.string.isRequired, // kodeverk
  sivilstand: PropTypes.string.isRequired, // kodeverk
  aktoerId: PropTypes.string.isRequired,
  navn: PropTypes.string.isRequired,
  dodsdato: PropTypes.string,
  fodselsdato: PropTypes.string,
  adresser: PropTypes.arrayOf(
    PropTypes.shape({
      adresseType: PropTypes.string, // kodeverk
      adresselinje1: PropTypes.string,
      adresselinje2: PropTypes.string,
      adresselinje3: PropTypes.string,
      postNummer: PropTypes.string,
      poststed: PropTypes.string,
      land: PropTypes.string,
      mottakerNavn: PropTypes.string,
    }),
  ),
  fnr: PropTypes.string,
  region: PropTypes.string.isRequired, // kodeverk
  annenPart: PropTypes.shape(),
  barn: PropTypes.arrayOf(PropTypes.shape()),
  harVerge: PropTypes.bool,
  barnSoktFor: PropTypes.arrayOf(PropTypes.shape()),
  barnFraTpsRelatertTilSoknad: PropTypes.arrayOf(PropTypes.shape()),
});

export default personopplysningPropType;
