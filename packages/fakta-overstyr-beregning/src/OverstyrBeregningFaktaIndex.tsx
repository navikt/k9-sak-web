import React from 'react';
import { createIntlCache, createIntl, RawIntlProvider } from 'react-intl';
import { Aksjonspunkt, ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';

import OverstyrBeregningFaktaForm from './components/OverstyrBeregningFaktaForm';
import messages from '../i18n/nb_NO.json';
import { OverstyrInputBeregningDto } from './types/OverstyrInputBeregningDto';

const intlCache = createIntlCache();
const intl = createIntl({ locale: 'nb-NO', messages }, intlCache);

interface Props {
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  overstyrInputBeregning: OverstyrInputBeregningDto[] | OverstyrInputBeregningDto;
  submitCallback: () => void;
  readOnly: boolean;
  submittable: boolean;
  aksjonspunkter: Aksjonspunkt[];
}

/**
 * OverstyrBeregningFaktaIndex
 */
const OverstyrBeregningFaktaIndex = ({
  arbeidsgiverOpplysningerPerId,
  overstyrInputBeregning,
  submitCallback,
  readOnly,
  submittable,
  aksjonspunkter,
}: Props) => (
  <RawIntlProvider value={intl}>
    <OverstyrBeregningFaktaForm
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      overstyrInputBeregning={overstyrInputBeregning}
      submitCallback={submitCallback}
      readOnly={readOnly}
      submittable={submittable}
      aksjonspunkter={aksjonspunkter}
    />
  </RawIntlProvider>
);

export default OverstyrBeregningFaktaIndex;
