import { decodeHtmlEntity } from '@fpsak-frontend/utils';
import { Vilkarperiode } from '@k9-sak-web/types';
import { TextAreaField } from '@navikt/ft-form-hooks';
import { hasValidText, maxLength, minLength, required } from '@navikt/ft-form-validators';
import { FunctionComponent } from 'react';
import { VilkarBegrunnelseFormState } from './FormState';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

interface OwnProps {
  isReadOnly: boolean;
}

interface StaticFunctions {
  transformValues: (values: VilkarBegrunnelseFormState) => VilkarBegrunnelseFormState;
  buildInitialValues: (periode: Vilkarperiode) => VilkarBegrunnelseFormState;
}

/**
 * VilkarBegrunnelse
 *
 * Presentasjonskomponent. Lar den NAV-ansatte skrive inn en begrunnelse før overstyring av vilkår eller beregning.
 */
const VilkarBegrunnelse: FunctionComponent<OwnProps> & StaticFunctions = ({ isReadOnly }) => (
  <TextAreaField
    name="begrunnelse"
    label="Vurdering"
    validate={[required, minLength3, maxLength1500, hasValidText]}
    maxLength={1500}
    readOnly={isReadOnly}
    placeholder="Begrunn vurderingen din"
  />
);

VilkarBegrunnelse.buildInitialValues = (periode: Vilkarperiode) => ({
  begrunnelse: decodeHtmlEntity(periode && periode.begrunnelse ? periode.begrunnelse : ''),
});

VilkarBegrunnelse.transformValues = (values: VilkarBegrunnelseFormState) => ({
  begrunnelse: values.begrunnelse,
});

export default VilkarBegrunnelse;
