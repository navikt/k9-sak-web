import PropTypes from 'prop-types';

// fra uttak
export const arbeidsgiverUttakPropType = PropTypes.shape({
  aktørId: PropTypes.string,
  identifikator: PropTypes.string,
  navn: PropTypes.string,
  virksomhet: PropTypes.bool,
});

// beregning
export const arbeidsforholdBeregningProptype = PropTypes.shape({
  arbeidsgiverNavn: PropTypes.string,
  arbeidsgiverId: PropTypes.string,
  startdato: PropTypes.string,
  opphoersdato: PropTypes.string,
  arbeidsforholdId: PropTypes.string,
});

export const arbeidsforholdPropType = PropTypes.shape({
  id: PropTypes.string,
  arbeidsforhold: PropTypes.shape({
    eksternArbeidsforholdId: PropTypes.string,
    internArbeidsforholdId: PropTypes.string,
  }),
  arbeidsgiver: PropTypes.shape({
    arbeidsgiverOrgnr: PropTypes.string,
    arbeidsgiverAktørId: PropTypes.string,
  }),
  yrkestittel: PropTypes.string,
  begrunnelse: PropTypes.string,
  perioder: PropTypes.arrayOf(
    PropTypes.shape({
      fom: PropTypes.string,
      tom: PropTypes.string,
    }),
  ),
  handlingType: PropTypes.shape({
    kode: PropTypes.string.isRequired,
  }),
  kilde: PropTypes.shape({
    kode: PropTypes.string.isRequired,
  }),
  permisjoner: PropTypes.arrayOf(
    PropTypes.shape({
      permisjonFom: PropTypes.string,
      permisjonTom: PropTypes.string,
      permisjonsprosent: PropTypes.number,
      type: PropTypes.shape({
        kode: PropTypes.string,
        kodeverk: PropTypes.string,
      }),
    }),
  ),
  stillingsprosent: PropTypes.number,
  aksjonspunktÅrsaker: PropTypes.arrayOf(
    PropTypes.shape({
      kode: PropTypes.string.isRequired,
      kodeverk: PropTypes.string,
    }),
  ),
  inntektsmeldinger: PropTypes.arrayOf(
    PropTypes.shape({
      journalpostId: PropTypes.string,
      mottattTidspunkt: PropTypes.string,
      status: PropTypes.shape({
        kode: PropTypes.string.isRequired,
      }),
      begrunnelse: PropTypes.string,
    }),
  ),
});

export const arbeidsgiverPropType = PropTypes.shape({
  referanse: PropTypes.string,
  identifikator: PropTypes.string,
  navn: PropTypes.string,
  fødselsdato: PropTypes.string,
});

export const arbeidsgiverMapPropType = PropTypes.shape({
  arbeidsgivere: PropTypes.instanceOf(Map).isRequired,
});

export default arbeidsforholdPropType;
