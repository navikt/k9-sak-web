import React from 'react';
// import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { DokumentStatus } from '@k9-sak-web/types';
import Vilkarperiode from '@k9-sak-web/types/src/vilkarperiode';
import { screen } from '@testing-library/react';
import { reduxForm } from 'redux-form';
import messages from '../../i18n/nb_NO.json';
import { SoknadsfristVilkarForm } from './SoknadsfristVilkarForm';

const periode = {
  vilkarStatus: { kode: vilkarUtfallType.IKKE_OPPFYLT, kodeverk: 'test' },
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
        status: { kode: vilkarUtfallType.IKKE_OPPFYLT, kodeverk: 'test' },
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
        status: { kode: vilkarUtfallType.IKKE_OPPFYLT, kodeverk: 'test' },
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
    const MockForm = reduxForm({ form: 'mock', onSubmit: vi.fn() })(({ children }) => <div>{children}</div>);
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    renderWithIntlAndReduxForm(
      <MockForm>
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
          saksbehandlere={{}}
        />
      </MockForm>,

      { messages },
    );

    expect(
      screen.getAllByText(
        (_, element) => element.textContent === 'SOKNAD innsendt 01.06.2020 (journalpostId: 12345)',
      )[0],
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(
        (_, element) => element.textContent === 'SOKNAD innsendt 01.06.2020 (journalpostId: 23456)',
      )[0],
    ).toBeInTheDocument();
    expect(screen.getAllByText('Vilkåret er oppfylt for hele perioden').length).toBe(2);
    expect(screen.getByRole('button', { name: 'Bekreft overstyring' })).toBeInTheDocument();
  });
});
