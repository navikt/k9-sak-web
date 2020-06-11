import { SøknadsperiodeFormValues } from '../SøknadsperiodeFieldArrayComponent';
import SøknadFormValue from './SøknadFormValue';

export default interface OppgittOpptjeningRevurderingFormValues {
  [SøknadFormValue.SØKNADSPERIODER]: SøknadsperiodeFormValues[];
  [SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2019]: number;
  [SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2020]: number;
  [SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_NYOPPSTARTET_DATO]: string;
  [SøknadFormValue.BEGRUNNELSE]: string;
}
