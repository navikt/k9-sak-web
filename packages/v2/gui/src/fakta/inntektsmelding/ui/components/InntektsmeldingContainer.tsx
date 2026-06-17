import { finnAktivtAksjonspunkt } from '@k9-sak-web/gui/utils/aksjonspunktUtils.js';
import { Vurdering as InntektsmeldingVurderingResponseKode } from '@k9-sak-web/backend/k9sak/kodeverk/kompletthet/Vurdering.js';
import { Box, Button, Heading } from '@navikt/ds-react';
import { useMemo, useState } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import { useKompletthetsoversikt } from '../../api/inntektsmeldingQueries';
import { useInntektsmeldingContext } from '../../context/InntektsmeldingContext';
import type { Tilstand, TilstandMedUiState, InntektsmeldingVurdering } from '../../types';
import { FieldName, InntektsmeldingVurderingRequestKode } from '../../types';
import {
  finnSisteAksjonspunkt,
  finnTilstanderSomRedigeres,
  finnTilstanderSomVurderes,
  ingenTilstanderHarMangler,
  transformKompletthetsdata,
} from '../../util/utils';
import InntektsmeldingAlerts from './InntektsmeldingAlerts.js';
import InntektsmeldingListe from './InntektsmeldingListe';

// Dette er nødvendig for å mappe vurdering fra backend til det formatet som forventes i requesten, da KompletthetsPeriode.vurdering bruker en generert enum (KAN_FORTSETTE), mens backend forventer FORTSETT
const responseToRequestVurdering: Record<string, InntektsmeldingVurdering> = {
  [InntektsmeldingVurderingResponseKode.KAN_FORTSETTE]: InntektsmeldingVurderingRequestKode.FORTSETT,
  [InntektsmeldingVurderingResponseKode.MANGLENDE_GRUNNLAG]: InntektsmeldingVurderingRequestKode.MANGLENDE_GRUNNLAG,
  [InntektsmeldingVurderingResponseKode.IKKE_INNTEKTSTAP]: InntektsmeldingVurderingRequestKode.IKKE_INNTEKTSTAP,
  [InntektsmeldingVurderingResponseKode.UAVKLART]: InntektsmeldingVurderingRequestKode.UAVKLART,
  [InntektsmeldingVurderingResponseKode.UDEFINERT]: InntektsmeldingVurderingRequestKode.UDEFINERT,
};

const buildFormDefaultValues = (tilstander: Tilstand[]): FieldValues =>
  Object.fromEntries(
    tilstander.flatMap(t => [
      [`${FieldName.BEGRUNNELSE}${t.periodeOpprinneligFormat}`, t.begrunnelse || ''],
      [
        `${FieldName.BESLUTNING}${t.periodeOpprinneligFormat}`,
        (t.vurdering ? responseToRequestVurdering[t.vurdering] : null) ?? null,
      ],
    ]),
  );

const InntektsmeldingContainer = () => {
  const { aksjonspunkter, readOnly, onFinished } = useInntektsmeldingContext();
  const { data: kompletthetResponse } = useKompletthetsoversikt();

  const tilstander = transformKompletthetsdata(kompletthetResponse);
  const aktivtAksjonspunkt = finnAktivtAksjonspunkt(aksjonspunkter);
  const sisteAksjonspunkt = finnSisteAksjonspunkt(aksjonspunkter);
  const gjeldeneAksjonspunkt = aktivtAksjonspunkt ?? sisteAksjonspunkt;
  const aksjonspunktKode = gjeldeneAksjonspunkt?.definisjon;

  const [editStates, setEditStates] = useState<Record<string, boolean>>({});

  const tilstanderMedUiState = useMemo<TilstandMedUiState[]>(
    () =>
      tilstander.map(tilstand => ({
        ...tilstand,
        redigeringsmodus: editStates[tilstand.periodeOpprinneligFormat] ?? false,
        setRedigeringsmodus: (state: boolean) =>
          setEditStates(prev => ({ ...prev, [tilstand.periodeOpprinneligFormat]: state })),
        begrunnelseFieldName: `${FieldName.BEGRUNNELSE}${tilstand.periodeOpprinneligFormat}`,
        beslutningFieldName: `${FieldName.BESLUTNING}${tilstand.periodeOpprinneligFormat}`,
      })),
    [tilstander, editStates],
  );

  const formMethods = useForm({
    mode: 'onTouched',
    defaultValues: buildFormDefaultValues(tilstander),
  });

  const { handleSubmit, formState } = formMethods;

  const tilstanderTilVurdering = [
    ...finnTilstanderSomVurderes(tilstanderMedUiState),
    ...finnTilstanderSomRedigeres(tilstanderMedUiState),
  ];
  const harFlereTilstanderTilVurdering = tilstanderTilVurdering.length > 1;
  const harIngenTilstanderTilVurdering = tilstanderTilVurdering.length === 0;

  const harAktivtAksjonspunkt = !!aktivtAksjonspunkt;
  const harEndretTidligereVurdering = !aktivtAksjonspunkt && sisteAksjonspunkt && formState.isDirty;
  const ingenTilstanderMangler = ingenTilstanderHarMangler(tilstanderMedUiState);
  const ferdigVurdert = harIngenTilstanderTilVurdering && ingenTilstanderMangler;
  const kanSendeInnFlereVurderinger =
    !readOnly && harFlereTilstanderTilVurdering && (harAktivtAksjonspunkt || harEndretTidligereVurdering);
  const kanFortsetteUtenEndring = !readOnly && harAktivtAksjonspunkt && ferdigVurdert;

  const onSubmit = async (data: FieldValues) => {
    if (!aksjonspunktKode) {
      throw new Error('AksjonspunktKode er ikke satt');
    }

    const perioder = tilstanderTilVurdering.map(tilstand => {
      const beslutning = data[tilstand.beslutningFieldName];
      const skalInkludereBegrunnelse =
        aksjonspunktKode !== '9069' || beslutning === InntektsmeldingVurderingRequestKode.FORTSETT;

      return {
        periode: tilstand.periodeOpprinneligFormat,
        fortsett: beslutning === InntektsmeldingVurderingRequestKode.FORTSETT,
        vurdering: beslutning,
        begrunnelse: skalInkludereBegrunnelse ? data[tilstand.begrunnelseFieldName] : undefined,
      };
    });

    await onFinished({
      '@type': aksjonspunktKode,
      kode: aksjonspunktKode,
      perioder,
    });
  };

  const onSubmitUtenEndring = async () => {
    if (!aksjonspunktKode) {
      throw new Error('AksjonspunktKode er ikke satt');
    }

    await onFinished({
      '@type': aksjonspunktKode,
      kode: aksjonspunktKode,
      perioder: tilstanderMedUiState.map(tilstand => {
        const vurdering =
          (tilstand.vurdering ? responseToRequestVurdering[tilstand.vurdering] : null) ??
          InntektsmeldingVurderingRequestKode.UDEFINERT;
        return {
          periode: tilstand.periodeOpprinneligFormat,
          fortsett: vurdering === InntektsmeldingVurderingRequestKode.FORTSETT,
          vurdering,
          begrunnelse: tilstand.begrunnelse || undefined,
        };
      }),
    });
  };

  return (
    <div>
      <Heading size="small" level="1">
        Inntektsmelding
      </Heading>
      <Heading size="xsmall" level="2" className="my-[0.625rem] mt-5">
        Opplysninger til beregning
      </Heading>
      {harAktivtAksjonspunkt && (
        <InntektsmeldingAlerts
          ferdigVurdert={ferdigVurdert}
          kanFortsetteUtenEndring={kanFortsetteUtenEndring}
          isSubmitting={formState.isSubmitting}
          onSubmit={handleSubmit(onSubmitUtenEndring)}
        />
      )}
      <Box>
        <InntektsmeldingListe
          tilstander={tilstanderMedUiState}
          onFormSubmit={payload => Promise.resolve(onFinished(payload))}
          aksjonspunkt={gjeldeneAksjonspunkt}
          formMethods={formMethods}
          harFlereTilstanderTilVurdering={harFlereTilstanderTilVurdering}
        />
      </Box>
      {kanSendeInnFlereVurderinger && (
        <Box marginBlock="space-24 space-0">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Button variant="primary" size="small" loading={formState.isSubmitting} disabled={formState.isSubmitting}>
              Send inn
            </Button>
          </form>
        </Box>
      )}
    </div>
  );
};

export default InntektsmeldingContainer;
