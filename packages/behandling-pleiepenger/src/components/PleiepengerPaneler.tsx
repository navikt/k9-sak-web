import {
  AksjonspunktUtenLøsningModal,
  ArbeidsgiverOpplysningerUtil,
  BehandlingPaVent,
  BehandlingUtil,
  harOpprettetAksjonspunkt,
  Rettigheter,
  SettPaVentParams,
} from '@k9-sak-web/behandling-felles';
import {
  ArbeidsgiverOpplysningerPerId,
  Behandling,
  Dokument,
  Fagsak,
  FagsakPerson,
  FeatureToggles,
} from '@k9-sak-web/types';
import moment from 'moment';
import React, { useState } from 'react';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { Arbeidstype } from '../types';
import FetchedData from '../types/FetchedData';
import ArbeidsgiverMedManglendePerioderListe from './ArbeidsgiverMedManglendePerioderListe';
import DataFetcher from './DataFetcher';
import PleiepengerFakta from './PleiepengerFakta';
import PleiepengerProsess from './PleiepengerProsess';
import { OverstyringUttakRequest } from '../types/OverstyringUttakRequest';

interface OwnProps {
  fetchedData: FetchedData;
  fagsak: Fagsak;
  fagsakPerson: FagsakPerson;
  behandling: Behandling;
  rettigheter: Rettigheter;
  valgtProsessSteg?: string;
  valgtFaktaSteg?: string;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  opneSokeside: () => void;
  hasFetchError: boolean;
  setBehandling: (behandling: Behandling) => void;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  featureToggles: FeatureToggles;
  dokumenter: Dokument[];
  lagreOverstyringUttak: (values: OverstyringUttakRequest) => void;
}

interface FaktaPanelInfo {
  urlCode: string;
  textCode: string;
}

interface Data {
  mangler?: {
    arbeidsgiver: {
      organisasjonsnummer: string;
      type: Arbeidstype;
      aktørId: string;
    };
    manglendePerioder: string[];
  }[];
}

const PleiepengerPaneler = ({
  fetchedData,
  fagsak,
  fagsakPerson,
  behandling,
  rettigheter,
  valgtProsessSteg,
  oppdaterProsessStegOgFaktaPanelIUrl,
  valgtFaktaSteg,
  oppdaterBehandlingVersjon,
  settPaVent,
  opneSokeside,
  hasFetchError,
  setBehandling,
  arbeidsgiverOpplysningerPerId,
  featureToggles,
  dokumenter,
  lagreOverstyringUttak,
}: OwnProps) => {
  const { kodeverk } = useKodeverkContext();
  const [apentFaktaPanelInfo, setApentFaktaPanel] = useState<FaktaPanelInfo>();
  const [beregningErBehandlet, setBeregningErBehandlet] = useState<boolean>(false);
  const harOpprettetAksjonspunkt9203 = harOpprettetAksjonspunkt(fetchedData?.aksjonspunkter || [], 9203);
  const behandlingUtil = new BehandlingUtil(behandling);
  const arbeidsgiverOpplysningerUtil = new ArbeidsgiverOpplysningerUtil(arbeidsgiverOpplysningerPerId);

  return (
    <>
      <BehandlingPaVent
        behandling={behandling}
        aksjonspunkter={fetchedData?.aksjonspunkter}
        kodeverk={kodeverk}
        settPaVent={settPaVent}
      />
      {harOpprettetAksjonspunkt9203 && (
        <DataFetcher
          url={behandlingUtil.getEndpointHrefByRel('psb-manglende-arbeidstid')}
          contentRenderer={(data: Data, isLoading, hasError) => (
            <AksjonspunktUtenLøsningModal
              melding={
                <div>
                  For å komme videre i behandlingen må du punsje manglende opplysninger om arbeidskategori og arbeidstid
                  i Punsj.
                  {isLoading && <p>Henter perioder...</p>}
                  {hasError && <p>Noe gikk galt under henting av perioder</p>}
                  {!isLoading && !hasError && (
                    <ArbeidsgiverMedManglendePerioderListe
                      arbeidsgivereMedPerioder={data.mangler
                        ?.filter(mangel => mangel.manglendePerioder?.length > 0)
                        .map(mangel => ({
                          arbeidsgiverNavn: arbeidsgiverOpplysningerUtil.finnArbeidsgiversNavn(
                            mangel.arbeidsgiver.organisasjonsnummer || mangel.arbeidsgiver.aktørId,
                          ),
                          organisasjonsnummer: mangel.arbeidsgiver.organisasjonsnummer,
                          perioder: mangel.manglendePerioder.map(periode => {
                            const [fom, tom] = periode.split('/');
                            const formattedFom = moment(fom, 'YYYY-MM-DD').format('DD.MM.YYYY');
                            const formattedTom = moment(tom, 'YYYY-MM-DD').format('DD.MM.YYYY');
                            return `${formattedFom} - ${formattedTom}`;
                          }),
                          arbeidstype: mangel.arbeidsgiver?.type,
                          personIdentifikator:
                            arbeidsgiverOpplysningerUtil.arbeidsgiverOpplysningerPerId[mangel.arbeidsgiver?.aktørId]
                              ?.personIdentifikator,
                        }))}
                    />
                  )}
                </div>
              }
            />
          )}
        />
      )}

      <PleiepengerProsess
        data={fetchedData}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling}
        rettigheter={rettigheter}
        valgtProsessSteg={valgtProsessSteg}
        valgtFaktaSteg={valgtFaktaSteg}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
        opneSokeside={opneSokeside}
        hasFetchError={hasFetchError}
        apentFaktaPanelInfo={apentFaktaPanelInfo}
        setBehandling={setBehandling}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        featureToggles={featureToggles}
        setBeregningErBehandlet={setBeregningErBehandlet}
        lagreOverstyringUttak={lagreOverstyringUttak}
      />
      <PleiepengerFakta
        behandling={behandling}
        data={fetchedData}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        rettigheter={rettigheter}
        hasFetchError={hasFetchError}
        valgtFaktaSteg={valgtFaktaSteg}
        valgtProsessSteg={valgtProsessSteg}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        setApentFaktaPanel={setApentFaktaPanel}
        setBehandling={setBehandling}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        dokumenter={dokumenter}
        featureToggles={featureToggles}
        beregningErBehandlet={beregningErBehandlet}
      />
    </>
  );
};

export default PleiepengerPaneler;
