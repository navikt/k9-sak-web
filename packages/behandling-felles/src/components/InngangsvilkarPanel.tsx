import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import {
  AksjonspunktHelpText,
  FadingPanel,
  LoadingPanel,
  NestedIntlProvider,
  VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import hentAktivePerioderFraVilkar from '@fpsak-frontend/utils/src/hentAktivePerioderFraVilkar';
import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import { EndpointData, Options, RestApiData } from '@k9-sak-web/rest-api-hooks/src/local-data/useMultipleRestApi';
import { Behandling, KodeverkMedNavn } from '@k9-sak-web/types';
import { HGrid, Tabs } from '@navikt/ds-react';
import React, { useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { AlleKodeverk } from '@k9-sak-web/lib/types/index.js';
import messages from '../i18n/nb_NO.json';
import { ProsessStegPanelUtledet } from '../util/prosessSteg/ProsessStegUtledet';
import styles from './inngangsvilkarPanel.module.css';

interface OwnProps {
  behandling: Behandling;
  alleKodeverk: AlleKodeverk;
  prosessStegData: ProsessStegPanelUtledet[];
  submitCallback: (data: any) => Promise<any>;
  apentFaktaPanelInfo?: { urlCode: string; textCode: string };
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  useMultipleRestApi: (endpoints: EndpointData[], options: Options) => RestApiData<any>;
}

const InngangsvilkarPanel = ({
  behandling,
  alleKodeverk,
  prosessStegData,
  submitCallback,
  apentFaktaPanelInfo,
  oppdaterProsessStegOgFaktaPanelIUrl,
  useMultipleRestApi,
}: OwnProps) => {
  const [visAllePerioder, setVisAllePerioder] = useState<boolean>(false);
  const filteredPanels = prosessStegData.filter(stegData => stegData.getKomponentData);

  const endepunkter = filteredPanels.flatMap(stegData =>
    stegData
      .getProsessStegDelPanelDef()
      .getEndepunkter()
      .map(e => ({ key: e })),
  );

  const { data, state } = useMultipleRestApi(endepunkter, { updateTriggers: [behandling.versjon], isCachingOn: true });

  const aksjonspunktTekstKoder = useMemo(
    () =>
      filteredPanels
        .filter(p => p.getErAksjonspunktOpen() && p.getAksjonspunktHjelpetekster().length > 0)
        .reduce((acc, p) => [...acc, p.getAksjonspunktHjelpetekster()], []),
    [filteredPanels],
  );

  const oppdaterUrl = useCallback(
    evt => {
      oppdaterProsessStegOgFaktaPanelIUrl(undefined, apentFaktaPanelInfo.urlCode);
      evt.preventDefault();
    },
    [apentFaktaPanelInfo],
  );

  const erIkkeFerdigbehandlet = useMemo(
    () => filteredPanels.some(p => p.getStatus() === vilkarUtfallType.IKKE_VURDERT),
    [behandling.versjon],
  );

  if (state === RestApiState.NOT_STARTED || state === RestApiState.LOADING) {
    return <LoadingPanel />;
  }

  const perioderFraTidligereBehandlinger = filteredPanels.filter(
    panel => hentAktivePerioderFraVilkar(panel.vilkar, true).length > 0,
  );

  const tabs =
    perioderFraTidligereBehandlinger.length > 0
      ? [
          { label: <FormattedMessage id="Vilkarsperioder.DenneBehandling" />, key: 'Vilkarsperioder.DenneBehandling' },
          { label: <FormattedMessage id="Vilkarsperioder.HittilIÅr" />, key: 'Vilkarsperioder.HittilIÅr' },
        ]
      : [{ label: <FormattedMessage id="Vilkarsperioder.DenneBehandling" />, key: 'Vilkarsperioder.DenneBehandling' }];

  return (
    <NestedIntlProvider messages={messages}>
      <FadingPanel>
        {((apentFaktaPanelInfo && erIkkeFerdigbehandlet) || aksjonspunktTekstKoder.length > 0) && (
          <>
            <AksjonspunktHelpText isAksjonspunktOpen>
              {apentFaktaPanelInfo && erIkkeFerdigbehandlet
                ? [
                    <>
                      <FormattedMessage id="InngangsvilkarPanel.AvventerAvklaringAv" />
                      <a href="" onClick={oppdaterUrl}>
                        <FormattedMessage id={apentFaktaPanelInfo.textCode} />
                      </a>
                    </>,
                  ]
                : aksjonspunktTekstKoder.map(kode => <FormattedMessage key={kode} id={kode} />)}
            </AksjonspunktHelpText>
            <VerticalSpacer thirtyTwoPx />
          </>
        )}
        <Tabs defaultValue="0">
          <Tabs.List>
            {tabs.map((tab, index) => (
              <Tabs.Tab
                key={tab.key}
                value={`${index}`}
                label={tab.label}
                onClick={() => setVisAllePerioder(index === 1)}
              />
            ))}
          </Tabs.List>
        </Tabs>
        <VerticalSpacer thirtyTwoPx />
        <HGrid gap="4" columns={{ xs: '6fr 6fr' }}>
          <div>
            {filteredPanels
              .filter((_panel, index) => index < 2)
              .map((stegData, index) => (
                <div key={stegData.getId()} className={index === 0 ? styles.panelLeftTop : styles.panelLeftBottom}>
                  {stegData.getProsessStegDelPanelDef().getKomponent({
                    ...data,
                    behandling,
                    alleKodeverk,
                    submitCallback,
                    visAllePerioder,
                    ...stegData.getKomponentData(),
                  })}
                </div>
              ))}
          </div>
          <div>
            {filteredPanels
              .filter((_panel, index) => index > 1)
              .map((stegData, index) => (
                <div key={stegData.getId()} className={index === 0 ? styles.panelRightTop : styles.panelRightBottom}>
                  {stegData.getProsessStegDelPanelDef().getKomponent({
                    ...data,
                    behandling,
                    alleKodeverk,
                    submitCallback,
                    visAllePerioder,
                    ...stegData.getKomponentData(),
                  })}
                </div>
              ))}
          </div>
        </HGrid>
      </FadingPanel>
    </NestedIntlProvider>
  );
};
export default InngangsvilkarPanel;
