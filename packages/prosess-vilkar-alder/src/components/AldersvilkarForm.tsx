import { AksjonspunktHelpText, VerticalSpacer } from '@fpsak-frontend/shared-components';
import React from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { Aksjonspunkt } from '@k9-sak-web/types';
import { Form, RadioGroupPanel, TextAreaField } from '@navikt/ft-form-hooks';
import { maxLength, minLength, required } from '@navikt/ft-form-validators';

import { Button } from '@navikt/ds-react';
import style from './AldersvilkarForm.module.css';

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
  angitteBarn: { personIdent: string }[];
};

const AldersvilkarForm = ({
  submitCallback,
  begrunnelseTekst,
  erVilkaretOk,
  erVurdert,
  angitteBarn,
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
  const methods = useForm<Inputs>({
    defaultValues: {
      begrunnelse: begrunnelseTekst,
      erVilkarOk: getErVilkaretOk(),
    },
  });
  const bekreftAksjonspunkt = (data: Inputs) => submitCallback([{ kode: aksjonspunktCodes.ALDERSVILKÅR, ...data }]);

  return (
    <Form<Inputs> formMethods={methods} onSubmit={bekreftAksjonspunkt}>
      <AksjonspunktHelpText isAksjonspunktOpen>
        {[<FormattedMessage key={1} id="AlderVilkar.Hjelpetekst" />]}
      </AksjonspunktHelpText>

      <VerticalSpacer sixteenPx />

      <div className={style.opplysninger}>
        <p className="label">
          <FormattedMessage id="AlderVilkar.Lese.Etikett.Opplysninger" />
        </p>
        <b>
          <FormattedMessage id="AlderVilkar.Lese.Etikett.Barn" />
        </b>
        {angitteBarn.map(barn => (
          <p className={style.barn} key={barn.personIdent}>
            {barn.personIdent}
          </p>
        ))}
      </div>

      <div className={style.vurdering}>
        <TextAreaField
          label={intl.formatMessage({ id: 'AlderVilkar.Lese.KroniskSyk' })}
          name="begrunnelse"
          validate={[required, minLength3, maxLength2000]}
          maxLength={2000}
        />
      </div>
      <VerticalSpacer sixteenPx />

      <RadioGroupPanel
        isHorizontal
        label={<FormattedMessage id="AlderVilkar.KroniskSyk" />}
        name="erVilkarOk"
        validate={[required]}
        isTrueOrFalseSelection
        radios={[
          { value: 'true', label: intl.formatMessage({ id: 'AlderVilkar.KroniskSyk.Ja' }) },
          { value: 'false', label: intl.formatMessage({ id: 'AlderVilkar.KroniskSyk.Nei' }) },
        ]}
      />
      <VerticalSpacer sixteenPx />

      <Button size="small" variant="primary" type="submit">
        <FormattedMessage id="AlderVilkar.Bekreft" />
      </Button>
    </Form>
  );
};

export default injectIntl(AldersvilkarForm);
