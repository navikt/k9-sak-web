import { finnAktivtAksjonspunkt } from '@k9-sak-web/gui/utils/aksjonspunktUtils.js';
import { Accordion, Alert, BodyLong, Box, Button, Heading } from '@navikt/ds-react';
import { useMemo, useState, type JSX } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import { useKompletthetsoversikt } from '../../api/inntektsmeldingQueries';
import { useInntektsmeldingContext } from '../../context/InntektsmeldingContext';
import { FieldName, InntektsmeldingVurderingRequestKode } from '../../types';
import type { Tilstand, TilstandMedUiState } from '../../types';
import {
  finnSisteAksjonspunkt,
  finnTilstanderSomRedigeres,
  finnTilstanderSomVurderes,
  ingenTilstanderHarMangler,
  transformKompletthetsdata,
} from '../../util/utils';
import PeriodList from './PeriodList';

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

const buildFormDefaultValues = (tilstander: Tilstand[]): FieldValues =>
  Object.fromEntries(
    tilstander.flatMap(t => [
      [`${FieldName.BEGRUNNELSE}${t.periodeOpprinneligFormat}`, t.begrunnelse || ''],
      [`${FieldName.BESLUTNING}${t.periodeOpprinneligFormat}`, null],
    ]),
  );

const Kompletthetsoversikt = (): JSX.Element => {
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

  const harAktivtAksjonspunkt = !!aktivtAksjonspunkt;
  const harEndretTidligereVurdering = !aktivtAksjonspunkt && sisteAksjonspunkt && formState.isDirty;
  const kanVurderes = harFlereTilstanderTilVurdering || ingenTilstanderHarMangler(tilstanderMedUiState);
  const kanSendeInn = !readOnly && kanVurderes && (harAktivtAksjonspunkt || harEndretTidligereVurdering);

  const onSubmit = (data: FieldValues) => {
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

      {harAktivtAksjonspunkt && <InntektsmeldingManglerInfo />}

      <Box.New marginBlock="6 0">
        <PeriodList
          tilstander={tilstanderMedUiState}
          onFormSubmit={onFinished}
          aksjonspunkt={gjeldeneAksjonspunkt}
          formMethods={formMethods}
          harFlereTilstanderTilVurdering={harFlereTilstanderTilVurdering}
        />
      </Box.New>

      {kanSendeInn && (
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
