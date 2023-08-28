import React, { useMemo } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { ReactComponent as FraBeslutterSvg } from '@fpsak-frontend/assets/images/arrow-return.svg';
import { ReactComponent as SendMeldingSvg } from '@fpsak-frontend/assets/images/email-send-1.svg';
import { ReactComponent as DokumenterSvg } from '@fpsak-frontend/assets/images/folder-big.svg';
import { ReactComponent as TilBeslutterSvg } from '@fpsak-frontend/assets/images/person-favorite-star-2.svg';
import { ReactComponent as HistorikkSvg } from '@fpsak-frontend/assets/images/synchronize-time.svg';
import { PencilWritingFillIcon, PencilWritingIcon } from '@navikt/aksel-icons';

import TabMeny from './components/TabMeny';
import SupportTabs from './supportTabs';

import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const getStyle = (isActive: boolean, isDisabled: boolean) => {
  if (isDisabled) {
    return { fill: '#c6c2bf' };
  }
  return isActive ? { fill: '#0067c5' } : { fill: '#3e3832' };
};

const TABS = {
  [SupportTabs.TIL_BESLUTTER]: {
    getSvg: (isActive, isDisabled, props) => <TilBeslutterSvg {...props} style={getStyle(isActive, isDisabled)} />,
    tooltipTextCode: 'SupportMenySakIndex.Godkjenning',
  },
  [SupportTabs.FRA_BESLUTTER]: {
    getSvg: (isActive, isDisabled, props) => <FraBeslutterSvg {...props} style={getStyle(isActive, isDisabled)} />,
    tooltipTextCode: 'SupportMenySakIndex.FraBeslutter',
  },
  [SupportTabs.HISTORIKK]: {
    getSvg: (isActive, isDisabled, props) => <HistorikkSvg {...props} style={getStyle(isActive, isDisabled)} />,
    tooltipTextCode: 'SupportMenySakIndex.Historikk',
  },
  [SupportTabs.MELDINGER]: {
    getSvg: (isActive, isDisabled, props) => <SendMeldingSvg {...props} style={getStyle(isActive, isDisabled)} />,
    tooltipTextCode: 'SupportMenySakIndex.Melding',
  },
  [SupportTabs.DOKUMENTER]: {
    getSvg: (isActive, isDisabled, props) => <DokumenterSvg {...props} style={getStyle(isActive, isDisabled)} />,
    tooltipTextCode: 'SupportMenySakIndex.Dokumenter',
  },
  [SupportTabs.NOTATER]: {
    getSvg: (isActive, isDisabled, props) =>
      isActive ? (
        <PencilWritingFillIcon {...props} title="Notater" fontSize="1.5rem" fill={isDisabled ? '#c6c2bf' : '#0067c5'} />
      ) : (
        <PencilWritingIcon {...props} title="Notater" fontSize="1.5rem" />
      ),
    tooltipTextCode: 'SupportMenySakIndex.Notater',
  },
};

const lagTabs = (tilgjengeligeTabs: string[], valgbareTabs: string[], valgtIndex?: number) =>
  Object.keys(TABS)
    .filter(key => tilgjengeligeTabs.includes(key))
    .map((key, index) => ({
      getSvg: TABS[key].getSvg,
      tooltip: intl.formatMessage({ id: TABS[key].tooltipTextCode }),
      isDisabled: !valgbareTabs.includes(key),
      isActive: index === valgtIndex,
    }));

interface OwnProps {
  tilgjengeligeTabs: string[];
  valgbareTabs: string[];
  valgtIndex?: number;
  onClick: (index: number) => void;
}

const SupportMenySakIndex = ({ tilgjengeligeTabs, valgbareTabs, valgtIndex, onClick }: OwnProps) => {
  const tabs = useMemo(
    () => lagTabs(tilgjengeligeTabs, valgbareTabs, valgtIndex),
    [tilgjengeligeTabs, valgbareTabs, valgtIndex],
  );

  return (
    <RawIntlProvider value={intl}>
      <TabMeny tabs={tabs} onClick={onClick} />
    </RawIntlProvider>
  );
};

export default SupportMenySakIndex;
