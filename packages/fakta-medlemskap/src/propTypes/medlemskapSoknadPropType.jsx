import PropTypes from 'prop-types';

const medlemskapSoknadPropType = PropTypes.shape({
  oppgittFordeling: PropTypes.shape({
    startDatoForPermisjon: PropTypes.string,
  }),
  oppgittTilknytning: PropTypes.shape({
    utlandsopphold: PropTypes.arrayOf(PropTypes.shape()),
  }),
});

export default medlemskapSoknadPropType;
