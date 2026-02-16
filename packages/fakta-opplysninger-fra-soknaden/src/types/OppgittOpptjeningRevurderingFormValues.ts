import SøknadFormValue from './SøknadFormValue';
import type SøknadsperiodeFormValues from './SøknadsperiodeFormValues';

export default interface OppgittOpptjeningRevurderingFormValues {
  [SøknadFormValue.SØKNADSPERIODER]: SøknadsperiodeFormValues[];
  [SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2019]: number;
  [SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2020]: number;
  [SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_NYOPPSTARTET_DATO]: string;
  [SøknadFormValue.BEGRUNNELSE]: string;
}
