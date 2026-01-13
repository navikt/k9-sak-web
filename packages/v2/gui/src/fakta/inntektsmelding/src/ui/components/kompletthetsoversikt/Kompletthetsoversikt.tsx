import { Period } from '@fpsak-frontend/utils';
import type { k9_sak_kontrakt_kompletthet_KompletthetsVurderingDto as KompletthetsVurdering } from '@navikt/k9-sak-typescript-client/types';
import { Box, Button } from '@navikt/ds-react';
import { useMemo, useState, type JSX } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import { useKompletthetsoversikt } from '../../../api/inntektsmeldingQueries';
import { useInntektsmeldingContext } from '../../../context/InntektsmeldingContext';
import FieldName from '../../../types/FieldName';
import { InntektsmeldingKode } from '../../../types/KompletthetData';
import type { Kompletthet, Tilstand, TilstandBeriket } from '../../../types/KompletthetData';
import {
  finnAktivtAksjonspunkt,
  finnTilstanderSomRedigeres,
  finnTilstanderSomVurderes,
  ingenTilstanderHarMangler,
} from '../../../util/utils';
import InntektsmeldingListeHeading from '../inntektsmelding-liste-heading/InntektsmeldingListeHeading';
import InntektsmeldingListe from '../inntektsmelding-liste/InntektsmeldingListe';
import PeriodList from '../period-list/PeriodList';
import InntektsmeldingManglerInfo from './InntektsmeldingManglerInfo';

function initKompletthetsdata({ tilstand }: KompletthetsVurdering): Kompletthet {
  return {
    tilstand: tilstand.map(({ periode, status, begrunnelse, tilVurdering, vurdering, vurdertAv, vurdertTidspunkt }) => {
      const [fom = '', tom = ''] = periode.split('/');
      return {
        periode: new Period(fom, tom),
        status,
        begrunnelse,
        tilVurdering,
        vurdering,
        periodeOpprinneligFormat: periode,
        vurdertAv,
        vurdertTidspunkt,
      };
    }),
  };
}

interface TilstandEditState {
  [periodeKey: string]: boolean;
}

const Kompletthetsoversikt = (): JSX.Element => {
  const { aksjonspunkter, readOnly, onFinished } = useInntektsmeldingContext();
  const { data: kompletthetResponse } = useKompletthetsoversikt();
  const kompletthetsoversikt = initKompletthetsdata(kompletthetResponse);
  const { tilstand: tilstander } = kompletthetsoversikt;

  const periods = tilstander.map(({ periode }) => periode);
  const statuses = tilstander.map(({ status }) => status);
  const aktivtAksjonspunkt = finnAktivtAksjonspunkt(aksjonspunkter);
  const forrigeAksjonspunkt = aksjonspunkter.sort((a, b) => Number(b.definisjon) - Number(a.definisjon))[0];
  const aktivtAksjonspunktKode = aktivtAksjonspunkt?.definisjon;
  const forrigeAksjonspunktKode = forrigeAksjonspunkt?.definisjon;
  const aksjonspunktKode = aktivtAksjonspunktKode || forrigeAksjonspunktKode;

  // Single state object to track edit modes for all periods
  const [editStates, setEditStates] = useState<TilstandEditState>({});

  const tilstanderBeriket = useMemo<TilstandBeriket[]>(
    () =>
      tilstander.map(tilstand => ({
        ...tilstand,
        redigeringsmodus: editStates[tilstand.periodeOpprinneligFormat] ?? false,
        setRedigeringsmodus: (state: boolean) => {
          setEditStates(prev => ({
            ...prev,
            [tilstand.periodeOpprinneligFormat]: state,
          }));
        },
        begrunnelseFieldName: `${FieldName.BEGRUNNELSE}${tilstand.periodeOpprinneligFormat}`,
        beslutningFieldName: `${FieldName.BESLUTNING}${tilstand.periodeOpprinneligFormat}`,
      })),
    [tilstander, editStates],
  );

  const buildDefaultValues = (tilstandList: Tilstand[]): FieldValues =>
    tilstandList.reduce((acc, tilstand) => ({
      ...acc,
      [`${FieldName.BEGRUNNELSE}${tilstand.periodeOpprinneligFormat}`]: tilstand.begrunnelse || '',
      [`${FieldName.BESLUTNING}${tilstand.periodeOpprinneligFormat}`]: null,
    }));

  const formMethods = useForm({
    mode: 'onTouched',
    defaultValues: buildDefaultValues(tilstander),
  });
  const { isDirty } = formMethods.formState;
  const { handleSubmit, watch } = formMethods;

  const tilstanderTilVurdering = [
    ...finnTilstanderSomVurderes(tilstanderBeriket),
    ...finnTilstanderSomRedigeres(tilstanderBeriket),
  ];

  const harFlereTilstanderTilVurdering = tilstanderTilVurdering.length > 1;

  const kanSendeInn = (): boolean => {
    if (harFlereTilstanderTilVurdering || ingenTilstanderHarMangler(tilstanderBeriket)) {
      if (!readOnly) {
        if (aktivtAksjonspunktKode ?? (forrigeAksjonspunktKode && isDirty)) return true;
      }
    }
    return false;
  };

  const listItemRenderer = (period: Period) => {
    const statusForPeriod = statuses[periods.indexOf(period)];
    return statusForPeriod ? <InntektsmeldingListe status={statusForPeriod} /> : null;
  };
  const listHeadingRenderer = () => <InntektsmeldingListeHeading />;

  const onSubmit = (data: FieldValues) => {
    const perioder = tilstanderTilVurdering.map(tilstand => {
      const skalViseBegrunnelse = !(
        aksjonspunktKode === '9069' && watch(tilstand.beslutningFieldName) !== InntektsmeldingKode.FORTSETT
      );
      const begrunnelse = skalViseBegrunnelse ? data[tilstand.begrunnelseFieldName] : undefined;
      return {
        begrunnelse,
        periode: tilstand.periodeOpprinneligFormat,
        fortsett: data[tilstand.beslutningFieldName] === InntektsmeldingKode.FORTSETT,
        vurdering: data[tilstand.beslutningFieldName],
      };
    });
    if (!aksjonspunktKode) {
      throw new Error('AksjonspunktKode er ikke satt');
    }
    onFinished({
      '@type': aksjonspunktKode,
      kode: aksjonspunktKode,
      perioder,
    });
  };

  return (
    <div>
      <h1 className="text-[1.375rem]">Inntektsmelding</h1>
      <h2 className="my-5 text-lg">Opplysninger til beregning</h2>
      {!!aktivtAksjonspunktKode && <InntektsmeldingManglerInfo />}
      <Box.New marginBlock="6 0">
        <PeriodList
          tilstander={tilstanderBeriket}
          listHeadingRenderer={listHeadingRenderer}
          listItemRenderer={listItemRenderer}
          onFormSubmit={onFinished}
          aksjonspunkt={aktivtAksjonspunkt || forrigeAksjonspunkt}
          formMethods={formMethods}
          harFlereTilstanderTilVurdering={harFlereTilstanderTilVurdering}
        />
      </Box.New>
      {kanSendeInn() && (
        <Box.New marginBlock="6 0">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Button variant="primary" size="small">
              Send inn
            </Button>
          </form>
        </Box.New>
      )}
    </div>
  );
};

export default Kompletthetsoversikt;
