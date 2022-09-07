import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';

// import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import Vilkarperiode from '@k9-sak-web/types/src/vilkarperiode';
import { DokumentStatus } from '@k9-sak-web/types';

import SoknadsfristVilkarDokument from './SoknadsfristVilkarDokument';
import { SoknadsfristVilkarForm } from './SoknadsfristVilkarForm';

const periode = {
  vilkarStatus: vilkarUtfallType.IKKE_OPPFYLT,
  vurderesIBehandlingen: true,
  periode: {
    fom: '2020-02-20',
    tom: '2020-02-25',
  },
} as Vilkarperiode;

const dokumenter = [
  {
    type: 'SOKNAD',
    status: [
      {
        periode: { fom: '2020-02-20', tom: '2020-02-25' },
        status: vilkarUtfallType.IKKE_OPPFYLT,
      },
    ],
    innsendingstidspunkt: '2020-06-01',
    journalpostId: '12345',
    avklarteOpplysninger: null,
    overstyrteOpplysninger: null,
  },
  {
    type: 'SOKNAD',
    status: [
      {
        periode: { fom: '2020-02-26', tom: '2020-02-27' },
        status: vilkarUtfallType.IKKE_OPPFYLT,
      },
    ],
    innsendingstidspunkt: '2020-06-01',
    journalpostId: '23456',
    avklarteOpplysninger: null,
    overstyrteOpplysninger: null,
  },
] as DokumentStatus[];

describe('<SoknadsfristVilkarForm>', () => {
  it('skal rendre form med knapp når vilkåret er overstyrt', () => {
    const wrapper = shallow(
      <SoknadsfristVilkarForm
        {...reduxFormPropsMock}
        behandlingId={1}
        behandlingVersjon={2}
        erOverstyrt
        erVilkarOk
        isReadOnly
        harAksjonspunkt
        harÅpentAksjonspunkt={false}
        overrideReadOnly={false}
        toggleOverstyring={() => undefined}
        aksjonspunkter={[]}
        status={vilkarUtfallType.IKKE_OPPFYLT}
        submitCallback={() => undefined}
        dokumenterIAktivPeriode={dokumenter}
        alleDokumenter={dokumenter}
        periode={periode}
        isSolvable
      />,
    );

    const melding = wrapper.find(FormattedMessage);
    expect(melding).toHaveLength(2);

    const vilkarResultatMedBegrunnelse = wrapper.find(SoknadsfristVilkarDokument);
    expect(vilkarResultatMedBegrunnelse).toHaveLength(2);
  });
});
