import { Kodeverk } from '@k9-sak-web/types';

interface VedtakVarselPropType {
  avslagsarsak: Record<string, any>;
  avslagsarsakFritekst?: string;
  id?: number;
  overskrift?: string;
  fritekstbrev?: string;
  skjæringstidspunkt: {
    dato: string;
  };
  redusertUtbetalingÅrsaker?: (string | Record<string, any>)[];
  vedtaksbrev: Kodeverk;
  vedtaksdato?: string;
}

export default VedtakVarselPropType;
