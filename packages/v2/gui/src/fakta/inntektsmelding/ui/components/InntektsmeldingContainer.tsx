import { finnAktivtAksjonspunkt } from '@k9-sak-web/gui/utils/aksjonspunktUtils.js';
import { Vurdering } from '@k9-sak-web/backend/k9sak/kodeverk/kompletthet/Vurdering.js';
import { Box, Heading } from '@navikt/ds-react';
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
  const harIngenTilstanderTilVurdering = tilstanderTilVurdering.length === 0;

  const harAktivtAksjonspunkt = !!aktivtAksjonspunkt;
  const ingenTilstanderMangler = ingenTilstanderHarMangler(tilstanderMedUiState);
  const ferdigVurdert = harIngenTilstanderTilVurdering && ingenTilstanderMangler;
  const kanFortsetteUtenEndring = !readOnly && harAktivtAksjonspunkt && ferdigVurdert;

  const onSubmitUtenEndring = async () => {
    if (!aksjonspunktKode) {
      throw new Error('AksjonspunktKode er ikke satt');
    }

    const tilstanderMedVurdering = tilstanderMedUiState.filter(
      (tilstand): tilstand is TilstandMedUiState & { vurdering: Vurdering } => tilstand.vurdering != null,
    );
    if (tilstanderMedVurdering.length !== tilstanderMedUiState.length) {
      throw new Error('Alle tilstander må ha en vurdering for å kunne fortsette uten endring');
    }

    await onFinished({
      '@type': aksjonspunktKode,
      kode: aksjonspunktKode,
      perioder: tilstanderMedVurdering.map(tilstand => ({
        periode: tilstand.periodeOpprinneligFormat,
        fortsett: tilstand.vurdering === Vurdering.KAN_FORTSETTE,
        vurdering: tilstand.vurdering,
        begrunnelse: tilstand.begrunnelse || undefined,
      })),
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
    </div>
  );
};

export default InntektsmeldingContainer;
