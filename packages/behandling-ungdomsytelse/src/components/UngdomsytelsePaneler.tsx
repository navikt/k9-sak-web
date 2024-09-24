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
import { Arbeidstype } from '../types';
import FetchedData from '../types/FetchedData';
import { OverstyringUttakRequest } from '../types/OverstyringUttakRequest';
import ArbeidsgiverMedManglendePerioderListe from './ArbeidsgiverMedManglendePerioderListe';
import DataFetcher from './DataFetcher';
import UngdomsytelseProsess from './UngdomsytelseProsess';

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
  opneSokeside: () => void;
  hasFetchError: boolean;
  setBehandling: (behandling: Behandling) => void;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  featureToggles: FeatureToggles;
  dokumenter: Dokument[];
  lagreOverstyringUttak: (values: OverstyringUttakRequest) => void;
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

const UngdomsytelsePaneler = ({
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
  opneSokeside,
  hasFetchError,
  setBehandling,
  arbeidsgiverOpplysningerPerId,
  featureToggles,
  lagreOverstyringUttak,
}: OwnProps) => {
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

      <UngdomsytelseProsess
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
        setBehandling={setBehandling}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        featureToggles={featureToggles}
        lagreOverstyringUttak={lagreOverstyringUttak}
      />
    </>
  );
};

export default UngdomsytelsePaneler;
