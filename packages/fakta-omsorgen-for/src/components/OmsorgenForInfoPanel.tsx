import React from 'react';
import FaktaEkspandertpanel from '@fpsak-frontend/fp-felles/src/fakta/FaktaEkspandertpanel';
import { faktaPanelCodes, withDefaultToggling } from '@fpsak-frontend/fp-felles';
import { FlexContainer, FlexRow, FlexColumn } from '@fpsak-frontend/shared-components';
import './omsorgenForInfo.less';
import SokerinfoTable from './SokerinfoTable';

const sokerinfo = [
  {
    header: 'Søkerens og barnets alder',
    forhold: [
      {
        forholdstekst: 'Søker er under 70 år',
        forholdskode: '1',
        erOppfylt: true,
        link: {
          to: 'https://www.vg.no',
          text: 'FR',
        },
      },
      {
        forholdstekst: 'Barnet er under 18 år',
        forholdskode: '2',
        erOppfylt: false,
        link: {
          to: 'https://www.vg.no',
          text: 'FR',
        },
      },
    ],
  },
  {
    header: 'Opptjening',
    forhold: [
      {
        forholdstekst: '28 dager',
        forholdskode: '1',
        erOppfylt: true,
        link: {
          to: 'https://www.vg.no',
          text: 'AA',
        },
      },
      {
        forholdstekst: 'Arbeidsgiver',
        forholdskode: '2',
        erOppfylt: false,
        link: {
          to: 'https://www.vg.no',
          text: 'FR',
        },
      },
    ],
  },
  {
    header: 'Omsorg',
    forhold: [
      {
        forholdstekst: 'Omsorgen for',
        forholdskode: '1',
        erOppfylt: true,
        link: {
          to: 'https://www.vg.no',
          text: 'SØ',
        },
      },
      {
        forholdstekst: 'Mor eller far',
        forholdskode: '2',
        erOppfylt: false,
        link: {
          to: 'https://www.vg.no',
          text: 'FR',
        },
      },
      {
        forholdstekst: 'Samme bosted',
        forholdskode: '3',
        erOppfylt: true,
        link: {
          to: 'https://www.vg.no',
          text: 'FR',
        },
      },
    ],
  },
];

const OmsorgenForInfoPanelImpl = ({ openInfoPanels, toggleInfoPanelCallback, readOnly, hasOpenAksjonspunkter }) => (
  <FaktaEkspandertpanel
    title="Fakta om alder og omsorg"
    hasOpenAksjonspunkter={hasOpenAksjonspunkter}
    readOnly={readOnly}
    isInfoPanelOpen={openInfoPanels.includes(faktaPanelCodes.OMSORGEN_FOR)}
    toggleInfoPanelCallback={toggleInfoPanelCallback}
    faktaId={faktaPanelCodes.OMSORGEN_FOR}
  >
    <FlexContainer>
      <FlexRow wrap>
        {sokerinfo.map(info => (
          <FlexColumn className="flexColumn--1-2" key={info.header}>
            <SokerinfoTable forhold={info.forhold} header={info.header} />
          </FlexColumn>
        ))}
      </FlexRow>
    </FlexContainer>
  </FaktaEkspandertpanel>
);

// TODO: state
// function mapStateToProps() {
//   return (state) => ({
//     state
//   });
// }
// const connectedComponent = connect(mapStateToProps)(OmsorgenForInfoPanelImpl);

const OmsorgenForInfoPanel = withDefaultToggling(faktaPanelCodes.OMSORGEN_FOR, [])(OmsorgenForInfoPanelImpl);

export default OmsorgenForInfoPanel;
