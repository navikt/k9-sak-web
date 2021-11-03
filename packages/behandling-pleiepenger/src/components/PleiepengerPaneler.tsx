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
  KodeverkMedNavn,
} from '@k9-sak-web/types';
import moment from 'moment';
import React, { useState } from 'react';
import FetchedData from '../types/fetchedDataTsType';
import ArbeidsgiverMedManglendePerioderListe from './ArbeidsgiverMedManglendePerioderListe';
import DataFetcher from './DataFetcher';
import PleiepengerFakta from './PleiepengerFakta';
import PleiepengerProsess from './PleiepengerProsess';
import Punsjstripe from './Punsjstripe';

interface OwnProps {
  fetchedData: FetchedData;
  fagsak: Fagsak;
  fagsakPerson: FagsakPerson;
  behandling: Behandling;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  rettigheter: Rettigheter;
  valgtProsessSteg?: string;
  valgtFaktaSteg?: string;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }, keepData: boolean) => Promise<any>;
  opneSokeside: () => void;
  hasFetchError: boolean;
  setBehandling: (behandling: Behandling) => void;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  featureToggles: FeatureToggles;
  dokumenter: Dokument[];
}

interface FaktaPanelInfo {
  urlCode: string;
  textCode: string;
}

const PleiepengerPaneler = ({
  fetchedData,
  fagsak,
  fagsakPerson,
  behandling,
  alleKodeverk,
  rettigheter,
  valgtProsessSteg,
  oppdaterProsessStegOgFaktaPanelIUrl,
  valgtFaktaSteg,
  oppdaterBehandlingVersjon,
  settPaVent,
  hentBehandling,
  opneSokeside,
  hasFetchError,
  setBehandling,
  arbeidsgiverOpplysningerPerId,
  featureToggles,
  dokumenter,
}: OwnProps) => {
  const [apentFaktaPanelInfo, setApentFaktaPanel] = useState<FaktaPanelInfo>();
  const harOpprettetAksjonspunkt9203 = harOpprettetAksjonspunkt(fetchedData?.aksjonspunkter || [], 9203);
  const behandlingUtil = new BehandlingUtil(behandling);
  const arbeidsgiverOpplysningerUtil = new ArbeidsgiverOpplysningerUtil(arbeidsgiverOpplysningerPerId);
  return (
    <>
      <BehandlingPaVent
        behandling={behandling}
        aksjonspunkter={fetchedData?.aksjonspunkter}
        kodeverk={alleKodeverk}
        settPaVent={settPaVent}
        hentBehandling={hentBehandling}
      />
      {harOpprettetAksjonspunkt9203 && (
        <DataFetcher
          url={behandlingUtil.getEndpointHrefByRel('psb-manglende-arbeidstid')}
          contentRenderer={(data, isLoading, hasError) => (
            <AksjonspunktUtenLøsningModal
              melding={
                <div>
                  For å komme videre i behandlingen må du punsje manglende opplysninger om arbeidskategori og arbeidstid
                  i Punsj.
                  {isLoading && <p>Henter perioder...</p>}
                  {hasError && <p>Noe gikk galt under henting av perioder</p>}
                  {!isLoading && !hasError && (
                    <ArbeidsgiverMedManglendePerioderListe
                      arbeidsgivereMedPerioder={data.mangler?.map(mangel => ({
                        arbeidsgiverNavn: arbeidsgiverOpplysningerUtil.finnArbeidsgiversNavn(
                          mangel.arbeidsgiver.organisasjonsnummer,
                        ),
                        organisasjonsnummer: mangel.arbeidsgiver.organisasjonsnummer,
                        perioder: mangel.manglendePerioder.map(periode => {
                          const [fom, tom] = periode.split('/');
                          const formattedFom = moment(fom, 'YYYY-MM-DD').format('DD.MM.YYYY');
                          const formattedTom = moment(tom, 'YYYY-MM-DD').format('DD.MM.YYYY');
                          return `${formattedFom} - ${formattedTom}`;
                        }),
                        arbeidstype: mangel.arbeidsgiver?.arbeidstype
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
        alleKodeverk={alleKodeverk}
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
      />
      <Punsjstripe aktørId={fagsakPerson.aktørId} saksnummer={fagsak.saksnummer} />
      <PleiepengerFakta
        behandling={behandling}
        data={fetchedData}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        alleKodeverk={alleKodeverk}
        rettigheter={rettigheter}
        hasFetchError={hasFetchError}
        valgtFaktaSteg={valgtFaktaSteg}
        valgtProsessSteg={valgtProsessSteg}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        setApentFaktaPanel={setApentFaktaPanel}
        setBehandling={setBehandling}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        dokumenter={dokumenter}
      />
    </>
  );
};

export default PleiepengerPaneler;
