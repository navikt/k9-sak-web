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
  navn: PropTypes.string,
  arbeidsgiverIdentifikator: PropTypes.string,
  arbeidsgiverIdentifiktorGUI: PropTypes.string,
  arbeidsforholdId: PropTypes.string,
  fomDato: PropTypes.string,
  tomDato: PropTypes.string,
  kilde: PropTypes.shape({
    kode: PropTypes.string.isRequired,
  }),
  mottattDatoInntektsmelding: PropTypes.string,
  stillingsprosent: PropTypes.number,
  brukArbeidsforholdet: PropTypes.bool,
  fortsettBehandlingUtenInntektsmelding: PropTypes.bool,
  erNyttArbeidsforhold: PropTypes.bool,
  erSlettet: PropTypes.bool,
  erstatterArbeidsforholdId: PropTypes.string,
  harErsattetEttEllerFlere: PropTypes.bool,
  ikkeRegistrertIAaRegister: PropTypes.bool,
  tilVurdering: PropTypes.bool,
  vurderOmSkalErstattes: PropTypes.bool,
  erEndret: PropTypes.bool,
  brukMedJustertPeriode: PropTypes.bool,
  overstyrtTom: PropTypes.string,
  lagtTilAvSaksbehandler: PropTypes.bool,
  basertPaInntektsmelding: PropTypes.bool,
  inntektMedTilBeregningsgrunnlag: PropTypes.bool,
  skjaeringstidspunkt: PropTypes.string,
  begrunnelse: PropTypes.string,
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
  brukPermisjon: PropTypes.bool,
});

export const arbeidsforholdV2PropType = PropTypes.shape({
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
  handlingType: PropTypes.string,
  kilde: PropTypes.arrayOf(PropTypes.string),
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
  aksjonspunktÅrsaker: PropTypes.arrayOf(PropTypes.string),
  inntektsmeldinger: PropTypes.arrayOf(
    PropTypes.shape({
      journalpostId: PropTypes.string,
      mottattTidspunkt: PropTypes.string,
      status: PropTypes.string,
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
