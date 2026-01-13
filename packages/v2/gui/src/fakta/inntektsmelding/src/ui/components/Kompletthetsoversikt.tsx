import { Period } from '@fpsak-frontend/utils';
import type { k9_sak_kontrakt_kompletthet_KompletthetsVurderingDto as KompletthetsVurdering } from '@navikt/k9-sak-typescript-client/types';
import { Accordion, Alert, BodyLong, Box, Button, Heading } from '@navikt/ds-react';
import { useMemo, useState, type JSX } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import { useKompletthetsoversikt } from '../../api/inntektsmeldingQueries';
import { useInntektsmeldingContext } from '../../context/InntektsmeldingContext';
import FieldName from '../../types/FieldName';
import { InntektsmeldingVurderingRequestKode } from '../../types/KompletthetData';
import type { Kompletthet, Tilstand, TilstandBeriket } from '../../types/KompletthetData';
import {
  finnAktivtAksjonspunkt,
  finnTilstanderSomRedigeres,
  finnTilstanderSomVurderes,
  ingenTilstanderHarMangler,
} from '../../util/utils';
import PeriodList from './PeriodList';

// Info panel shown when inntektsmelding is missing
const InntektsmeldingManglerInfo = (): JSX.Element => (
  <>
    <Box.New marginBlock="0 6">
      <Alert variant="warning" size="small">
        <Heading spacing size="xsmall" level="3">
          Vurder om du kan fortsette behandlingen uten inntektsmelding.
        </Heading>
        <BodyLong>
          Inntektsmelding mangler for en eller flere arbeidsgivere, eller for ett eller flere arbeidsforhold hos samme
          arbeidsgiver.
        </BodyLong>
      </Alert>
    </Box.New>
    <Box.New marginBlock="0 6">
      <Alert variant="info" size="small">
        <Accordion>
          <Accordion.Item>
            <Accordion.Header className="before:hidden after:hidden">
              <Heading className="!mb-0 font-normal" spacing size="xsmall" level="3">
                Når kan du gå videre uten inntektsmelding?
              </Heading>
            </Accordion.Header>
            <Accordion.Content>
              Vurder om du kan gå videre uten alle inntektsmeldinger hvis:
              <ul className="m-0 pl-6">
                <li>Det er rapportert fast og regelmessig lønn de siste 3 månedene før skjæringstidspunktet.</li>
                <li>
                  Det ikke er rapportert lønn hos arbeidsforholdet de siste 3 månedene før skjæringstidspunktet.
                  Beregningsgrunnlaget for denne arbeidsgiveren vil settes til 0,-.
                </li>
                <li>
                  Måneden for skjæringstidspunktet er innrapportert til A-ordningen. Hvis det er innrapportert lavere
                  lønn enn foregående måneder kan det tyde på at arbeidsgiver ikke lenger utbetaler lønn. Det er dermed
                  lavere risiko for at arbeidsgiver vil kreve refusjon.
                </li>
              </ul>
              <Box.New marginBlock="6 0">
                Du bør ikke gå videre uten inntektsmelding hvis:
                <ul className="m-0 pl-6">
                  <li>
                    Det er arbeidsforhold og frilansoppdrag i samme organisasjon (sjekk i Aa-registeret). I disse
                    tilfellene trenger vi inntektsmelding for å skille hva som er arbeidsinntekt og frilansinntekt i
                    samme organisasjon.
                  </li>
                  <li>
                    Måneden for skjæringstidspunktet er innrapportert til A-ordningen, og det er utbetalt full lønn.
                    Dette tyder på at arbeidsgiver forskutterer lønn og vil kreve refusjon. I disse tilfellene bør vi
                    ikke utbetale til bruker, men vente på inntektsmelding.
                  </li>
                </ul>
              </Box.New>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </Alert>
    </Box.New>
  </>
);

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

  const onSubmit = (data: FieldValues) => {
    const perioder = tilstanderTilVurdering.map(tilstand => {
      const skalViseBegrunnelse = !(
        aksjonspunktKode === '9069' &&
        watch(tilstand.beslutningFieldName) !== InntektsmeldingVurderingRequestKode.FORTSETT
      );
      const begrunnelse = skalViseBegrunnelse ? data[tilstand.begrunnelseFieldName] : undefined;
      return {
        begrunnelse,
        periode: tilstand.periodeOpprinneligFormat,
        fortsett: data[tilstand.beslutningFieldName] === InntektsmeldingVurderingRequestKode.FORTSETT,
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
