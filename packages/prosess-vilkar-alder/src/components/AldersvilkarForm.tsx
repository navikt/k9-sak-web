import React from 'react';
import { useForm } from 'react-hook-form';
import { AksjonspunktHelpTextTemp, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';

import { Aksjonspunkt } from '@k9-sak-web/types';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Form, RadioGroupPanel, TextAreaField } from '@navikt/ft-form-hooks';
import { maxLength, minLength, required } from '@navikt/ft-form-validators';

type Inputs = {
  begrunnelse: string;
  erVilkarOk: string;
};

type Props = {
  relevantAksjonspunkt: Aksjonspunkt;
  submitCallback: (any) => void;
  begrunnelseTekst: string;
  erVilkaretOk: boolean | null;
  erVurdert: boolean;
};

const AldersvilkarForm = ({
  submitCallback,
  begrunnelseTekst,
  erVilkaretOk,
  erVurdert,
  intl,
}: Props & WrappedComponentProps) => {
  const minLength3 = minLength(3);
  const maxLength2000 = maxLength(1500);
  const getErVilkaretOk = () => {
    if (!erVurdert) return null;

    if (erVilkaretOk === true) return 'true';
    if (erVilkaretOk === false) return 'false';
    return null;
  };
  const methods = useForm<Inputs>({ defaultValues: { begrunnelse: begrunnelseTekst, erVilkarOk: getErVilkaretOk() } });
  const bekreftAksjonspunkt = data => submitCallback([{ kode: aksjonspunktCodes.ALDERSVILKÅR, ...data }]);

  return (
    <Form formMethods={methods} onSubmit={bekreftAksjonspunkt}>
      <Row>
        <AksjonspunktHelpTextTemp isAksjonspunktOpen>
          {[<FormattedMessage key={1} id="AlderVilkar.Hjelpetekst" />]}
        </AksjonspunktHelpTextTemp>
      </Row>
      <VerticalSpacer sixteenPx />
      <Row>
        <TextAreaField label="Begrunnelse" name="begrunnelse" validate={[required, minLength3, maxLength2000]} />
      </Row>
      <VerticalSpacer sixteenPx />
      <Row>
        <Column>
          <RadioGroupPanel
            label={<FormattedMessage id="AlderVilkar.KroniskSyk" />}
            name="erVilkarOk"
            validate={[required]}
            radios={[
              { value: 'true', label: intl.formatMessage({ id: 'AlderVilkar.KroniskSyk.Ja' }) },
              { value: 'false', label: intl.formatMessage({ id: 'AlderVilkar.KroniskSyk.Nei' }) },
            ]}
          />
        </Column>
      </Row>
      <VerticalSpacer sixteenPx />
      <Row>
        <Hovedknapp htmlType="submit">
          <FormattedMessage id="AlderVilkar.Bekreft" />
        </Hovedknapp>
      </Row>
    </Form>
  );
};

export default injectIntl(AldersvilkarForm);
