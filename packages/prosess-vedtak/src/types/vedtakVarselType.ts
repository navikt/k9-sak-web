import { Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';
import { redusertUtbetalingArsakType } from '../kodeverk/redusertUtbetalingArsak';

interface VedtakVarselType {
  avslagsarsak: KodeverkMedNavn;
  avslagsarsakFritekst?: string;
  id?: number;
  overskrift?: string;
  fritekstbrev?: string;
  skjæringstidspunkt: {
    dato: string;
  };
  redusertUtbetalingÅrsaker?: redusertUtbetalingArsakType[];
  vedtaksbrev: Kodeverk;
  vedtaksdato?: string;
}

export default VedtakVarselType;
