import PropTypes from 'prop-types';

const feilutbetalingFaktaPropType = PropTypes.shape({
  behandlingFakta: PropTypes.shape({
    perioder: PropTypes.arrayOf(
      PropTypes.shape({
        fom: PropTypes.string.isRequired,
        tom: PropTypes.string.isRequired,
        belop: PropTypes.number.isRequired,
      }),
    ),
    totalPeriodeFom: PropTypes.string.isRequired,
    totalPeriodeTom: PropTypes.string.isRequired,
    aktuellFeilUtbetaltBeløp: PropTypes.number.isRequired,
    tidligereVarseltBeløp: PropTypes.number,
    behandlingÅrsaker: PropTypes.arrayOf(
      PropTypes.shape({
        behandlingArsakType: PropTypes.string.isRequired,
      }),
    ),
    behandlingsresultat: PropTypes.shape({
      type: PropTypes.string.isRequired,
      konsekvenserForYtelsen: PropTypes.arrayOf(PropTypes.string.isRequired),
    }),
    tilbakekrevingValg: PropTypes.shape({
      videreBehandling: PropTypes.string.isRequired,
    }),
    datoForRevurderingsvedtak: PropTypes.string.isRequired,
    begrunnelse: PropTypes.string,
  }),
});

export default feilutbetalingFaktaPropType;
