import PropTypes from 'prop-types';

const vilkårPeriodePropType = PropTypes.shape({
  periode: PropTypes.shape({
    fom: PropTypes.string.isRequired,
    tom: PropTypes.string.isRequired,
  }).isRequired,
});

export default vilkårPeriodePropType;
