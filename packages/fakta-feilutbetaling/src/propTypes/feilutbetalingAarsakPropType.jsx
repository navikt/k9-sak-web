import PropTypes from 'prop-types';

const feilutbetalingAarsakPropType = PropTypes.shape({
  hendelseTyper: PropTypes.arrayOf(PropTypes.shape({
    hendelseType: PropTypes.string,
    hendelseUndertyper: PropTypes.string,
  })).isRequired,
});

export default feilutbetalingAarsakPropType;
