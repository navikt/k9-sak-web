import behandleImageURL from '@fpsak-frontend/assets/images/advarsel.svg';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { FlexColumn, FlexContainer, FlexRow, Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { BeregningsresultatFp } from '@k9-sak-web/types';
import { Button, HGrid, Label } from '@navikt/ds-react';
import { Form, RadioGroupPanel, TextAreaField } from '@navikt/ft-form-hooks';
import { hasValidText, maxLength, minLength, required } from '@navikt/ft-form-validators';
import { AksjonspunktDto, BeregningsresultatMedUtbetaltePeriodeDto } from '@navikt/k9-sak-typescript-client';
import { useForm } from 'react-hook-form';
import styles from './tilbaketrekkpanel.module.css';

const radioFieldName = 'radioVurderTilbaketrekk';
const begrunnelseFieldName = 'begrunnelseVurderTilbaketrekk';

const maxLength1500 = maxLength(1500);
const minLength3 = minLength(3);

export const transformValues = (values: TilbaketrekkpanelFormState): TransformValues => {
  const hindreTilbaketrekk = values[radioFieldName];
  const begrunnelse = values[begrunnelseFieldName];
  return {
    kode: aksjonspunktCodes.VURDER_TILBAKETREKK,
    begrunnelse,
    hindreTilbaketrekk,
  };
};

export const buildInitialValues = (
  vurderTilbaketrekkAP?: AksjonspunktDto,
  beregningsresultat?: BeregningsresultatFp | BeregningsresultatMedUtbetaltePeriodeDto,
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
  beregningsresultat?: BeregningsresultatFp | BeregningsresultatMedUtbetaltePeriodeDto;
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
      <div className={styles.container}>
        <FlexContainer>
          <FlexRow>
            <FlexColumn>
              <Image className={styles.image} alt="Aksjonspunkt" src={behandleImageURL} />
            </FlexColumn>
            <FlexColumn>
              <div className={styles.divider} />
            </FlexColumn>
            <FlexColumn className={styles.aksjonspunktText}>
              <div className={styles.oneElement}>
                <Label size="small" as="p" className={styles.wordwrap}>
                  Pleiepengene er utbetalt til søker, arbeidsgiver krever nå refusjon fra startdato av pleiepengene.
                  Vurder om beløpet som er feilutbetalt skal tilbakekreves fra søker eller om dette er en sak mellom
                  arbeidstaker og arbeidsgiver.
                </Label>
              </div>
            </FlexColumn>
          </FlexRow>
        </FlexContainer>
      </div>
      <VerticalSpacer twentyPx />
      <Form formMethods={formMethods} onSubmit={handleSubmit}>
        <HGrid gap="1" columns={{ xs: '9fr 3fr' }}>
          <RadioGroupPanel
            name={radioFieldName}
            validate={[required]}
            isHorizontal
            isReadOnly={readOnly}
            isEdited={!isAksjonspunktOpen(vurderTilbaketrekkAP.status)}
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
        <HGrid gap="1" columns={{ xs: '6fr 6fr' }}>
          <TextAreaField
            name={begrunnelseFieldName}
            label="Vurdering"
            validate={[required, maxLength1500, minLength3, hasValidText]}
            maxLength={1500}
            readOnly={readOnly}
          />
        </HGrid>
        <HGrid gap="1" columns={{ xs: '2fr 10fr' }}>
          <div>
            <VerticalSpacer eightPx />
            <Button
              variant="primary"
              size="small"
              loading={formMethods.formState.isSubmitting}
              disabled={
                formMethods.formState.isSubmitting ||
                readOnly ||
                (readOnlySubmitButton && !formMethods.formState.isDirty)
              }
            >
              Bekreft og fortsett
            </Button>
          </div>
        </HGrid>
      </Form>
    </div>
  );
};

export default Tilbaketrekkpanel;
