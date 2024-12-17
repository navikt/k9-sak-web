import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { QueryClientWrapper } from '@k9-sak-web/gui/utils/test-helpers/reactQueryUtils.js';
import { Aksjonspunkt } from '@k9-sak-web/types';
import { screen } from '@testing-library/react';
import messages from '../../i18n/nb_NO.json';
import OpptjeningVilkarForm from './OpptjeningVilkarForm';

const periode = {
  avslagKode: '1035',
  begrunnelse: null,
  merknad: {
    kode: '-',
    kodeverk: 'et eller annet',
  },
  merknadParametere: {
    antattGodkjentArbeid: 'P9D',
    antattOpptjeningAktivitetTidslinje: 'LocalDateTimeline<2020-03-27, 2020-04-04 [1]> = [[2020-03-27, 2020-04-04]]',
  },
  periode: { fom: '2020-04-24', tom: '2020-04-24' },
  vilkarStatus: { kode: 'IKKE_OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
  vurderesIBehandlingen: true,
};

describe('<OpptjeningVilkarForm>', () => {
  it('skal vise OpptjeningVilkarAksjonspunktPanel når en har aksjonspunkt', () => {
    renderWithIntlAndReduxForm(
      <QueryClientWrapper>
        <OpptjeningVilkarForm
          readOnlySubmitButton
          readOnly
          isAksjonspunktOpen
          submitCallback={vi.fn()}
          behandlingId={1}
          behandlingVersjon={2}
          aksjonspunkter={
            [
              {
                definisjon: {
                  kode: aksjonspunktCodes.SVANGERSKAPSVILKARET,
                },
                status: {
                  kode: aksjonspunktStatus.OPPRETTET,
                },
                begrunnelse: undefined,
              },
            ] as Aksjonspunkt[]
          }
          status="test"
          lovReferanse="Dette er en lovreferanse"
          periodeIndex={0}
          vilkårPerioder={[periode]}
          opptjeninger={[
            {
              opptjeningAktivitetList: [],
              fastsattOpptjening: {
                opptjeningFom: '2017-08-15',
                opptjeningTom: '2017-08-31',
                opptjeningperiode: { dager: 16, måneder: 0 },
                fastsattOpptjeningAktivitetList: [],
                vurderesIAksjonspunkt: true,
              },
            },
          ]}
        />
      </QueryClientWrapper>,
      { messages },
    );

    expect(screen.getByRole('heading', { name: 'Opptjening' })).toBeInTheDocument();
    expect(
      screen.getAllByText(
        (_, element) =>
          element.textContent === 'Søker har ikke oppfylt krav om 28 dagers opptjening, vilkåret er ikke oppfylt.',
      )[0],
    ).toBeInTheDocument();
  });
});
