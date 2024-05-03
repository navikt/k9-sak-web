import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@k9-sak-web/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@k9-sak-web/kodeverk/src/behandlingStatus';
import { render } from '@testing-library/react';
import React from 'react';
import MargMarkering from './MargMarkering';

describe('<MargMarkering>', () => {
  const elmt = <span>test</span>;

  it('skal rendre rendre children uten marg når det ikke finnes aksjonspunkter', () => {
    const { container } = render(
      <MargMarkering
        behandlingStatus={{
          kode: behandlingStatus.BEHANDLING_UTREDES,
          kodeverk: 'BEHANDLING_STATUS',
        }}
        aksjonspunkter={[]}
        isReadOnly={false}
      >
        {elmt}
      </MargMarkering>,
    );
    expect(container.getElementsByClassName('prosesspunkt').length).toBe(1);
  });

  it('skal rendre rendre children med gul marg når det finnes åpne og løsbare aksjonspunkter', () => {
    const { container } = render(
      <MargMarkering
        behandlingStatus={{
          kode: behandlingStatus.BEHANDLING_UTREDES,
          kodeverk: 'BEHANDLING_STATUS',
        }}
        aksjonspunkter={[
          {
            status: {
              kode: aksjonspunktStatus.OPPRETTET,
              kodeverk: 'AKSJONSPUNKT_STATUS',
            },
            definisjon: {
              kode: aksjonspunktCodes.AUTO_MANUELT_SATT_PÅ_VENT,
              kodeverk: 'AKSJONSPUNKT_KODE',
            },
            kanLoses: true,
            erAktivt: true,
          },
        ]}
        isReadOnly={false}
      >
        {elmt}
      </MargMarkering>,
    );

    expect(container.getElementsByClassName('prosesspunkt visAksjonspunkt').length).toBe(1);
  });

  it('skal rendre rendre children med rød marg når et aksjonspunkt er sendt tilbake fra beslutter', () => {
    const { container } = render(
      <MargMarkering
        behandlingStatus={{
          kode: behandlingStatus.BEHANDLING_UTREDES,
          kodeverk: 'BEHANDLING_STATUS',
        }}
        aksjonspunkter={[
          {
            status: {
              kode: aksjonspunktStatus.OPPRETTET,
              kodeverk: 'AKSJONSPUNKT_STATUS',
            },
            definisjon: {
              kode: aksjonspunktCodes.AUTO_MANUELT_SATT_PÅ_VENT,
              kodeverk: 'AKSJONSPUNKT_KODE',
            },
            kanLoses: true,
            erAktivt: true,
            toTrinnsBehandling: true,
            toTrinnsBehandlingGodkjent: false,
          },
        ]}
        isReadOnly={false}
      >
        {elmt}
      </MargMarkering>,
    );

    expect(container.getElementsByClassName('prosesspunkt ikkeAkseptertAvBeslutter visAksjonspunkt').length).toBe(1);
  });
});
