import SøknadFormValue from './SøknadFormValue';

export default interface SøknadsperiodeFormValues {
  [SøknadFormValue.FRILANSINNTEKT_I_SØKNADSPERIODE_FOR_SSN]: string;
  [SøknadFormValue.FRILANSER_INNTEKT_I_SØKNADSPERIODEN]: string;
  [SøknadFormValue.FRILANSER_STARTDATO_FOR_SØKNADEN]: string;
  [SøknadFormValue.NÆRINGSINNTEKT_I_SØKNADSPERIODE_FOR_FRILANS]: string;
  [SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_I_SØKNADSPERIODEN]: string;
  [SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_STARTDATO_FOR_SØKNADEN]: string;
  [SøknadFormValue.HAR_SØKT_SOM_FRILANSER]: boolean;
  [SøknadFormValue.HAR_SØKT_SOM_SSN]: boolean;
  [SøknadFormValue.INNTEKT_SOM_ARBEIDSTAKER]: string;
}
