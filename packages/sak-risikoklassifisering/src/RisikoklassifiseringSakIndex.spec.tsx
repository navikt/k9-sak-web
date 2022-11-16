import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import kontrollresultatKode from './kodeverk/kontrollresultatKode';
import RisikoklassifiseringSakIndex from './RisikoklassifiseringSakIndex';
import ManglendeKlassifiseringPanel from './components/ManglendeKlassifiseringPanel';
import IngenRisikoPanel from './components/IngenRisikoPanel';
import HoyRisikoTittel from './components/HoyRisikoTittel';

const lagRisikoklassifisering = kode => ({
  kontrollresultat: kode,
  medlFaresignaler: undefined,
  iayFaresignaler: undefined,
});

describe('<RisikoklassifiseringSakIndex>', () => {
  it('skal rendere korrekt komponent når det mangler klassifisering', () => {
    const wrapper = shallow(
      <RisikoklassifiseringSakIndex
        behandlingId={1}
        behandlingVersjon={1}
        risikoklassifisering={undefined}
        isPanelOpen={false}
        readOnly={false}
        submitAksjonspunkt={sinon.spy()}
        toggleRiskPanel={sinon.spy()}
      />,
    );
    expect(wrapper.find(ManglendeKlassifiseringPanel)).toHaveLength(1);
    expect(wrapper.find(IngenRisikoPanel)).toHaveLength(0);
    expect(wrapper.find(HoyRisikoTittel)).toHaveLength(0);
  });

  it('skal rendere korrekt komponent når det ikke er utfør klassifisering', () => {
    const wrapper = shallow(
      <RisikoklassifiseringSakIndex
        behandlingId={1}
        behandlingVersjon={1}
        risikoklassifisering={lagRisikoklassifisering(kontrollresultatKode.IKKE_KLASSIFISERT)}
        isPanelOpen={false}
        readOnly={false}
        submitAksjonspunkt={sinon.spy()}
        toggleRiskPanel={sinon.spy()}
      />,
    );
    expect(wrapper.find(ManglendeKlassifiseringPanel)).toHaveLength(1);
    expect(wrapper.find(IngenRisikoPanel)).toHaveLength(0);
    expect(wrapper.find(HoyRisikoTittel)).toHaveLength(0);
  });

  it('skal rendere korrekt komponent når det er ikke_hoy resultat', () => {
    const wrapper = shallow(
      <RisikoklassifiseringSakIndex
        behandlingId={1}
        behandlingVersjon={1}
        risikoklassifisering={lagRisikoklassifisering(kontrollresultatKode.IKKE_HOY)}
        isPanelOpen={false}
        readOnly={false}
        submitAksjonspunkt={sinon.spy()}
        toggleRiskPanel={sinon.spy()}
      />,
    );
    expect(wrapper.find(ManglendeKlassifiseringPanel)).toHaveLength(0);
    expect(wrapper.find(IngenRisikoPanel)).toHaveLength(1);
    expect(wrapper.find(HoyRisikoTittel)).toHaveLength(0);
  });

  it('skal rendere korrekt komponent når det er hoy resultat', () => {
    const wrapper = shallow(
      <RisikoklassifiseringSakIndex
        behandlingId={1}
        behandlingVersjon={1}
        risikoklassifisering={lagRisikoklassifisering(kontrollresultatKode.HOY)}
        isPanelOpen={false}
        readOnly={false}
        submitAksjonspunkt={sinon.spy()}
        toggleRiskPanel={sinon.spy()}
      />,
    );
    expect(wrapper.find(ManglendeKlassifiseringPanel)).toHaveLength(0);
    expect(wrapper.find(IngenRisikoPanel)).toHaveLength(0);
    expect(wrapper.find(HoyRisikoTittel)).toHaveLength(1);
  });
});
