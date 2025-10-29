import { AksjonspunktHelpText, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { useForm } from 'react-hook-form';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { Aksjonspunkt } from '@k9-sak-web/types';
import { maxLength, minLength, required } from '@navikt/ft-form-validators';

import { Button, HStack, Radio } from '@navikt/ds-react';
import { RhfForm, RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
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
  const formMethods = useForm<Inputs>({
    defaultValues: {
      begrunnelse: begrunnelseTekst,
      erVilkarOk: getErVilkaretOk(),
    },
  });
  const bekreftAksjonspunkt = (data: Inputs) => submitCallback([{ kode: aksjonspunktCodes.ALDERSVILKÅR, ...data }]);

  return (
    <RhfForm formMethods={formMethods} onSubmit={bekreftAksjonspunkt}>
      <AksjonspunktHelpText isAksjonspunktOpen>
        {[Vurder om aldersvilkåret er oppfylt. På grunn av barnets alder, må det være innvilget vedtak om at barnet er kronisk syk.]}
      </AksjonspunktHelpText>

      <VerticalSpacer sixteenPx />

      <div className={style.opplysninger}>
        <p className="label">
          Opplysninger fra søknaden:
        </p>
        <b>
          Søkers barn:
        </b>
        {angitteBarn.map(barn => (
          <p className={style.barn} key={barn.personIdent}>
            {barn.personIdent}
          </p>
        ))}
      </div>

      <div className={style.vurdering}>
        <RhfTextarea
          control={formMethods.control}
          label={"Vurder om aldersvilkåret er oppfylt"}
          name="begrunnelse"
          validate={[required, minLength3, maxLength2000]}
          maxLength={2000}
        />
      </div>
      <VerticalSpacer sixteenPx />

      <RhfRadioGroup
        control={formMethods.control}
        label={Er aldersvilkåret oppfylt?}
        name="erVilkarOk"
        validate={[required]}
      >
        <HStack gap="space-16">
          <Radio value={true}>{"Ja"}</Radio>
          <Radio value={false}>{"Nei"}</Radio>
        </HStack>
      </RhfRadioGroup>
      <VerticalSpacer sixteenPx />

      <Button size="small" variant="primary" type="submit">
        Bekreft og fortsett
      </Button>
    </RhfForm>
  );
};

export default injectIntl(AldersvilkarForm);
