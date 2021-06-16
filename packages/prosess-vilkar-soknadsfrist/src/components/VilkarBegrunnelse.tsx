import React, { FunctionComponent } from 'react';
import { useIntl } from 'react-intl';

import { TextAreaField } from '@fpsak-frontend/form';
import { decodeHtmlEntity, hasValidText, maxLength, minLength, requiredIfNotPristine } from '@fpsak-frontend/utils';
import { Aksjonspunkt } from '@k9-sak-web/types';

import styles from './vilkarBegrunnelse.less';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

interface OwnProps {
  begrunnelseLabel?: string;
  isReadOnly: boolean;
}

interface StaticFunctions {
  buildInitialValues?: (aksjonspunkt: Aksjonspunkt) => any;
  transformValues?: (values: any) => any;
}

/**
 * VilkarBegrunnelse
 *
 * Presentasjonskomponent. Lar den NAV-ansatte skrive inn en begrunnelse før overstyring av vilkår eller beregning.
 */
const VilkarBegrunnelse: FunctionComponent<OwnProps> & StaticFunctions = ({
  isReadOnly,
  begrunnelseLabel = 'VilkarBegrunnelse.Vilkar',
}) => {
  const intl = useIntl();
  return (
    <TextAreaField
      name="begrunnelse"
      label={intl.formatMessage({ id: begrunnelseLabel })}
      validate={[requiredIfNotPristine, minLength3, maxLength1500, hasValidText]}
      textareaClass={styles.explanationTextarea}
      maxLength={1500}
      readOnly={isReadOnly}
      placeholder={intl.formatMessage({ id: 'VilkarBegrunnelse.BegrunnVurdering' })}
    />
  );
};

VilkarBegrunnelse.buildInitialValues = (aksjonspunkt: Aksjonspunkt) => ({
  begrunnelse: decodeHtmlEntity(aksjonspunkt && aksjonspunkt.begrunnelse ? aksjonspunkt.begrunnelse : ''),
});

export default VilkarBegrunnelse;
