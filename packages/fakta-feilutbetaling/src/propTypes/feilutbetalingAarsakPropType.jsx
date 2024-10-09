import PropTypes from 'prop-types';

const feilutbetalingAarsakPropType = PropTypes.shape({
  hendelseTyper: PropTypes.arrayOf(
    PropTypes.shape({
      hendelseType: PropTypes.string.isRequired,
      hendelseUndertyper: PropTypes.arrayOf(PropTypes.string.isRequired),
    }),
  ).isRequired,
});

export default feilutbetalingAarsakPropType;
