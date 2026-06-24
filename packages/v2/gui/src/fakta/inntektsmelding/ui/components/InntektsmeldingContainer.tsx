import { finnAktivtAksjonspunkt } from '@k9-sak-web/gui/utils/aksjonspunktUtils.js';
import { Vurdering } from '@k9-sak-web/backend/k9sak/kodeverk/kompletthet/Vurdering.js';
import { Box, Button, Heading } from '@navikt/ds-react';
import { useMemo, useState } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import { useKompletthetsoversikt } from '../../api/inntektsmeldingQueries';
import { useInntektsmeldingContext } from '../../context/InntektsmeldingContext';
import type { Tilstand, TilstandMedUiState } from '../../types';
import { FieldName } from '../../types';
import {
  finnSisteAksjonspunkt,
  finnTilstanderSomRedigeres,
  finnTilstanderSomVurderes,
  ingenTilstanderHarMangler,
  transformKompletthetsdata,
} from '../../util/utils';
import InntektsmeldingAlerts from './InntektsmeldingAlerts.js';
import InntektsmeldingListe from './InntektsmeldingListe';

const buildFormDefaultValues = (tilstander: Tilstand[]): FieldValues =>
  Object.fromEntries(
    tilstander.flatMap(t => [
      [`${FieldName.BEGRUNNELSE}${t.periodeOpprinneligFormat}`, t.begrunnelse || ''],
      [`${FieldName.BESLUTNING}${t.periodeOpprinneligFormat}`, t.vurdering || undefined],
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

  const alleTilstanderHarVurdering = tilstanderMedUiState
    .filter(t => t.tilVurdering)
    .map(t => t.vurdering)
    .every(vurdering => vurdering !== undefined);

  const harAktivtAksjonspunkt = !!aktivtAksjonspunkt;
  const harEndretTidligereVurdering = !aktivtAksjonspunkt && sisteAksjonspunkt && formState.isDirty;
  const ingenTilstanderMangler = ingenTilstanderHarMangler(tilstanderMedUiState);
  const ferdigVurdert = alleTilstanderHarVurdering && ingenTilstanderMangler;
  const kanSendeInnFlereVurderinger =
    !readOnly && harFlereTilstanderTilVurdering && (harAktivtAksjonspunkt || harEndretTidligereVurdering);
  const kanFortsetteUtenEndring = !readOnly && harAktivtAksjonspunkt && ferdigVurdert;

  const onSubmit = async (data: FieldValues) => {
    if (!aksjonspunktKode) {
      throw new Error('AksjonspunktKode er ikke satt');
    }

    const perioder = tilstanderTilVurdering.map(tilstand => {
      const beslutning = data[tilstand.beslutningFieldName];
      const skalInkludereBegrunnelse = aksjonspunktKode !== '9069' || beslutning === Vurdering.KAN_FORTSETTE;

      return {
        periode: tilstand.periodeOpprinneligFormat,
        fortsett: beslutning === Vurdering.KAN_FORTSETTE,
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
    const mappetVurdering = tilstanderMedUiState
      .filter(tilstand => tilstand.tilVurdering)
      .map(tilstand => {
        const { vurdering } = tilstand;

        if (!vurdering) {
          // Hvis dette er tilfellet, så er det en feil i logikken for når "send inn uten endring" rendres
          throw new Error(`Vurdering mangler for periode ${tilstand.periode.prettifyPeriod()}`);
        }

        return {
          periode: tilstand.periodeOpprinneligFormat,
          fortsett: vurdering === Vurdering.KAN_FORTSETTE,
          vurdering,
          begrunnelse: tilstand.begrunnelse || undefined,
        };
      });
    await onFinished({
      '@type': aksjonspunktKode,
      kode: aksjonspunktKode,
      perioder: mappetVurdering,
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
