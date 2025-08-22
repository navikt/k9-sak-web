import { aksjonspunktkodeDefinisjonType } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktkodeDefinisjon.js';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { Alert, Button, HGrid } from '@navikt/ds-react';
import { RhfForm, RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import { hasValidText, maxLength, minLength, required } from '@navikt/ft-form-validators';
import type { k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { useForm } from 'react-hook-form';
import type { BeregningsresultatMedUtbetaltePeriodeDto } from '../../types/BeregningsresultatMedUtbetaltePeriode';

const radioFieldName = 'radioVurderTilbaketrekk';
const begrunnelseFieldName = 'begrunnelseVurderTilbaketrekk';

const maxLength1500 = maxLength(1500);
const minLength3 = minLength(3);

export const isAksjonspunktOpen = (statusKode: string): boolean => statusKode === aksjonspunktStatus.OPPRETTET;

export const transformValues = (values: TilbaketrekkpanelFormState): TransformValues => {
  const hindreTilbaketrekk = values[radioFieldName];
  const begrunnelse = values[begrunnelseFieldName];
  return {
    kode: aksjonspunktkodeDefinisjonType.VURDER_TILBAKETREKK,
    begrunnelse,
    hindreTilbaketrekk,
  };
};

export const buildInitialValues = (
  vurderTilbaketrekkAP?: AksjonspunktDto,
  beregningsresultat?: BeregningsresultatMedUtbetaltePeriodeDto,
) => {
  let tidligereValgt: boolean | undefined = undefined;
  if (beregningsresultat && 'skalHindreTilbaketrekk' in beregningsresultat) {
    tidligereValgt = beregningsresultat.skalHindreTilbaketrekk;
  }
  if (
    tidligereValgt === undefined ||
    tidligereValgt === null ||
    !vurderTilbaketrekkAP ||
    !vurderTilbaketrekkAP.begrunnelse
  ) {
    return undefined;
  }
  return {
    radioVurderTilbaketrekk: tidligereValgt,
    begrunnelseVurderTilbaketrekk: vurderTilbaketrekkAP.begrunnelse,
  };
};

type TilbaketrekkpanelFormState = {
  radioVurderTilbaketrekk: boolean;
  begrunnelseVurderTilbaketrekk: string;
};

type TransformValues = {
  kode: string;
  begrunnelse: string;
  hindreTilbaketrekk: boolean;
};

interface PureOwnProps {
  readOnly: boolean;
  vurderTilbaketrekkAP?: AksjonspunktDto;
  submitCallback: (data: TransformValues) => Promise<any>;
  readOnlySubmitButton: boolean;
  beregningsresultat?: BeregningsresultatMedUtbetaltePeriodeDto;
}

export const Tilbaketrekkpanel = ({
  readOnly,
  vurderTilbaketrekkAP,
  beregningsresultat,
  submitCallback,
  readOnlySubmitButton,
}: PureOwnProps) => {
  const formMethods = useForm<TilbaketrekkpanelFormState>({
    defaultValues: buildInitialValues(vurderTilbaketrekkAP, beregningsresultat),
  });

  const handleSubmit = async (values: TilbaketrekkpanelFormState) => {
    await submitCallback(transformValues(values));
  };
  return (
    <div>
      <Alert size="small" variant="warning" className="max-w-[750px]">
        Pleiepengene er utbetalt til søker, arbeidsgiver krever nå refusjon fra startdato av pleiepengene. Vurder om
        beløpet som er feilutbetalt skal tilbakekreves fra søker eller om dette er en sak mellom arbeidstaker og
        arbeidsgiver.
      </Alert>
      <RhfForm formMethods={formMethods} onSubmit={handleSubmit} className="mt-5">
        <HGrid gap="space-4" columns={{ xs: '9fr 3fr' }}>
          <RhfRadioGroup
            control={formMethods.control}
            name={radioFieldName}
            validate={[required]}
            isHorizontal
            isReadOnly={readOnly}
            isEdited={vurderTilbaketrekkAP?.status ? !isAksjonspunktOpen(vurderTilbaketrekkAP.status) : false}
            isTrueOrFalseSelection
            radios={[
              {
                value: 'false',
                label: 'Tilbakekrev fra søker',
              },
              {
                value: 'true',
                label: 'Ikke tilbakekrev fra søker',
              },
            ]}
          />
        </HGrid>
        <HGrid gap="space-4" columns={{ xs: '6fr 6fr' }}>
          <RhfTextarea
            control={formMethods.control}
            name={begrunnelseFieldName}
            label="Vurdering"
            validate={[required, maxLength1500, minLength3, hasValidText]}
            maxLength={1500}
            readOnly={readOnly}
          />
        </HGrid>
        <HGrid gap="space-4" columns={{ xs: '2fr 10fr' }}>
          <div>
            <Button
              variant="primary"
              size="small"
              loading={formMethods.formState.isSubmitting}
              disabled={
                formMethods.formState.isSubmitting ||
                readOnly ||
                (readOnlySubmitButton && !formMethods.formState.isDirty)
              }
              className="mt-2"
            >
              Bekreft og fortsett
            </Button>
          </div>
        </HGrid>
      </RhfForm>
    </div>
  );
};

export default Tilbaketrekkpanel;
