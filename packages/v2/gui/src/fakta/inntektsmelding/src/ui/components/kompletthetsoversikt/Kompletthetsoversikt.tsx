import { Period } from '@fpsak-frontend/utils';
import { Box, Button } from '@navikt/ds-react';
import { useMemo, useState, type JSX } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import useContainerContext from '../../../context/useContainerContext';
import AksjonspunktRequestPayload from '../../../types/AksjonspunktRequestPayload';
import FieldName from '../../../types/FieldName';
import { Kode, Kompletthet, Tilstand, TilstandBeriket } from '../../../types/KompletthetData';
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
import styles from './kompletthetsoversikt.module.css';

interface KompletthetsoversiktProps {
  kompletthetsoversikt: Kompletthet;
  onFormSubmit: (payload: AksjonspunktRequestPayload) => void;
}

interface TilstandEditState {
  [periodeKey: string]: boolean;
}

const Kompletthetsoversikt = ({ kompletthetsoversikt, onFormSubmit }: KompletthetsoversiktProps): JSX.Element => {
  const { aksjonspunkter, readOnly } = useContainerContext();
  const { tilstand: tilstander } = kompletthetsoversikt;

  const periods = tilstander.map(({ periode }) => periode);
  const statuses = tilstander.map(({ status }) => status);
  const aktivtAksjonspunkt = finnAktivtAksjonspunkt(aksjonspunkter);
  const forrigeAksjonspunkt = aksjonspunkter.sort((a, b) => Number(b.definisjon.kode) - Number(a.definisjon.kode))[0];
  const aktivtAksjonspunktKode = aktivtAksjonspunkt?.definisjon?.kode;
  const forrigeAksjonspunktKode = forrigeAksjonspunkt?.definisjon?.kode;
  const aksjonspunktKode = aktivtAksjonspunktKode ?? forrigeAksjonspunktKode;

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
    tilstandList.reduce(
      (acc, tilstand) => ({
        ...acc,
        [`${FieldName.BEGRUNNELSE}${tilstand.periodeOpprinneligFormat}`]: tilstand?.begrunnelse ?? '',
        [`${FieldName.BESLUTNING}${tilstand.periodeOpprinneligFormat}`]: null,
      }),
      {} as FieldValues,
    );

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

  const listItemRenderer = (period: Period) => <InntektsmeldingListe status={statuses[periods.indexOf(period)]} />;
  const listHeadingRenderer = () => <InntektsmeldingListeHeading />;

  const onSubmit = (data: FieldValues) => {
    const perioder = tilstanderTilVurdering.map(tilstand => {
      const skalViseBegrunnelse = !(aksjonspunktKode === '9069' && watch(tilstand.beslutningFieldName) !== Kode.FORTSETT);
      const begrunnelse = skalViseBegrunnelse ? (data[tilstand.begrunnelseFieldName] as string) : undefined;
      return {
        begrunnelse,
        periode: tilstand.periodeOpprinneligFormat,
        fortsett: data[tilstand.beslutningFieldName] === Kode.FORTSETT,
        kode: aksjonspunktKode ?? '',
      };
    });
    onFormSubmit({
      '@type': aksjonspunktKode ?? '',
      kode: aksjonspunktKode ?? '',
      perioder,
    });
  };

  return (
    <div className={styles.kompletthet}>
      <h1 className={styles.kompletthet__mainHeading}>Inntektsmelding</h1>
      <h2 className={styles.kompletthet__subHeading}>Opplysninger til beregning</h2>
      <InntektsmeldingManglerInfo manglerInntektsmelding={!!aktivtAksjonspunktKode} />
      <Box.New marginBlock="6 0">
        <PeriodList
          tilstander={tilstanderBeriket}
          listHeadingRenderer={listHeadingRenderer}
          listItemRenderer={listItemRenderer}
          onFormSubmit={onFormSubmit}
          aksjonspunkt={aktivtAksjonspunkt ?? forrigeAksjonspunkt}
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
