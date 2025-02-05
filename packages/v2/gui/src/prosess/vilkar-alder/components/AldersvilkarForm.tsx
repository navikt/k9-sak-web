import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/generated';
import { aksjonspunktkodeDefinisjonType } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktkodeDefinisjon.js';
import { Box, Button } from '@navikt/ds-react';
import { Form, RadioGroupPanel, TextAreaField } from '@navikt/ft-form-hooks';
import { maxLength, minLength, required } from '@navikt/ft-form-validators';
import { useForm } from 'react-hook-form';
import AksjonspunktHelpText from '../../../shared/aksjonspunktHelpText/AksjonspunktHelpText';
import style from './AldersvilkarForm.module.css';

type Inputs = {
  begrunnelse: string;
  erVilkarOk: string | null;
};

type Props = {
  relevantAksjonspunkt: AksjonspunktDto;
  submitCallback: (data: any) => void;
  begrunnelseTekst: string;
  erVilkaretOk: boolean | null;
  erVurdert: boolean;
  angitteBarn: { personIdent: string }[];
};

const AldersvilkarForm = ({ submitCallback, begrunnelseTekst, erVilkaretOk, erVurdert, angitteBarn }: Props) => {
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
  const bekreftAksjonspunkt = (data: Inputs) => {
    submitCallback([{ kode: aksjonspunktkodeDefinisjonType.ALDERSVILKÅR, ...data }]);
  };

  return (
    <Form<Inputs> formMethods={methods} onSubmit={bekreftAksjonspunkt}>
      <AksjonspunktHelpText isAksjonspunktOpen>
        {[
          'Vurder om aldersvilkåret er oppfylt.',
          'På grunn av barnets alder, må det være innvilget vedtak om at barnet er kronisk syk.',
        ]}
      </AksjonspunktHelpText>

      <Box marginBlock={'4 0'}>
        <div className={style.opplysninger}>
          <p className="label">Opplysninger fra søknaden:</p>
          <b>Søkers barn:</b>
          {angitteBarn.map(barn => (
            <p className={style.barn} key={barn.personIdent}>
              {barn.personIdent}
            </p>
          ))}
        </div>

        <div className={style.vurdering}>
          <TextAreaField
            label="Vurder om aldersvilkåret er oppfylt"
            name="begrunnelse"
            validate={[required, minLength3, maxLength2000]}
            maxLength={2000}
          />
        </div>
      </Box>
      <Box marginBlock={'4 0'}>
        <RadioGroupPanel
          isHorizontal
          label="Er aldersvilkåret oppfylt?"
          name="erVilkarOk"
          validate={[required]}
          isTrueOrFalseSelection
          radios={[
            { value: 'true', label: 'Ja' },
            { value: 'false', label: 'Nei' },
          ]}
        />
      </Box>
      <Box marginBlock={'4 0'}>
        <Button size="small" variant="primary" type="submit">
          Bekreft og fortsett
        </Button>
      </Box>
    </Form>
  );
};

export default AldersvilkarForm;
