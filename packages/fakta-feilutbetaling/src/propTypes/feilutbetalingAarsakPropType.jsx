import PropTypes from 'prop-types';

const feilutbetalingAarsakPropType = PropTypes.shape({
  hendelseTyper: PropTypes.arrayOf(
    PropTypes.shape({
      hendelseType: PropTypes.string.isRequired,
      hendelseUndertyper: PropTypes.arrayOf(PropTypes.string.isRequired),
      /*
      #KODEVERk: usikker på denne, hvordan den skal se ut. 
      Om det er en kode eller et oppslag med navn etc. 
      skrev om over, så får vi se
      hendelseType: PropTypes.shape({
        kode: PropTypes.string.isRequired,
        navn: PropTypes.string.isRequired,
      }),
      hendelseUndertyper: PropTypes.arrayOf(
        PropTypes.shape({
          kode: PropTypes.string.isRequired,
          navn: PropTypes.string.isRequired,
        }),
      ),
      */
    }),
  ).isRequired,
});

export default feilutbetalingAarsakPropType;
