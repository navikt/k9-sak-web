import React, { useMemo, useCallback, useStateW } from 'react';
import { createIntl, createIntlCache, RawIntlProvider, FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import Tabs from 'nav-frontend-tabs';

import { FadingPanel, VerticalSpacer, AksjonspunktHelpTextHTML, LoadingPanel } from '@fpsak-frontend/shared-components';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { Behandling, KodeverkMedNavn } from '@k9-sak-web/types';
import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import { Options, EndpointData, RestApiData } from '@k9-sak-web/rest-api-hooks/src/local-data/useMultipleRestApi';

import hentAktivePerioderFraVilkar from "@fpsak-frontend/utils/src/hentAktivePerioderFraVilkar";
import { ProsessStegPanelUtledet } from '../util/prosessSteg/ProsessStegUtledet';
import messages from '../i18n/nb_NO.json';

import styles from './inngangsvilkarPanel.less';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface OwnProps {
  behandling: Behandling;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
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

  const perioderFraTidligereBehandlinger = filteredPanels.filter(panel => hentAktivePerioderFraVilkar(panel.vilkar, true).length > 0);

  return (
    <RawIntlProvider value={intl}>
      <FadingPanel>
        {((apentFaktaPanelInfo && erIkkeFerdigbehandlet) || aksjonspunktTekstKoder.length > 0) && (
          <>
            <AksjonspunktHelpTextHTML>
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
            </AksjonspunktHelpTextHTML>
            <VerticalSpacer thirtyTwoPx />
          </>
        )}
        <Tabs
          tabs={
            perioderFraTidligereBehandlinger.length > 0
              ? [{label: <FormattedMessage id="Vilkarsperioder.DenneBehandling"/>},
                {label: <FormattedMessage id="Vilkarsperioder.HittilIÅr"/>}]
              : [{label: <FormattedMessage id="Vilkarsperioder.DenneBehandling"/>}]
          }
          onChange={(e, index) => setVisAllePerioder(index === 1)}
        />
        <VerticalSpacer thirtyTwoPx />
        <Row className="">
          <Column xs="6">
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
          </Column>
          <Column xs="6">
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
          </Column>
        </Row>
      </FadingPanel>
    </RawIntlProvider>
  );
};
export default InngangsvilkarPanel;
