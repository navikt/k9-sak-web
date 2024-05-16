import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import alleKodeverkKlageV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkKlageV2.json';
import React from 'react';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import { BehandlingType } from '@k9-sak-web/lib/types/index.js';
import { intlMock } from '../../i18n';
import messages from '../../i18n/nb_NO.json';
import { VedtakKlageFormImpl, getAvvisningsAarsaker, getIsAvvist, getKlageresultat } from './VedtakKlageForm';

const KLAGE_OMGJORT_TEKST = 'VedtakKlageForm.KlageOmgjortGunst';

describe('<VedtakKlageForm>', () => {
  it('skal vise riktige avvisningsårsaker', () => {
    const avvistArsaker = ['KLAGET_FOR_SENT', 'KLAGER_IKKE_PART'];
    const forhandsvisVedtaksbrevFunc = vi.fn();
    const klageVurderingResultatNFP = {
      klageVurdertAv: 'NAY',
      klageVurdering: 'AVVIS_KLAGE',
    };
    renderWithIntl(
      <KodeverkProvider
        behandlingType={BehandlingType.KLAGE}
        kodeverk={alleKodeverkV2}
        klageKodeverk={alleKodeverkKlageV2}
        tilbakeKodeverk={{}}
      >
        <VedtakKlageFormImpl
          {...reduxFormPropsMock}
          intl={intlMock}
          readOnly={false}
          isAvvist
          isOmgjort={false}
          behandlingsResultatTekst={KLAGE_OMGJORT_TEKST}
          behandlingsresultatTypeKode=""
          isOpphevOgHjemsend={false}
          avvistArsaker={avvistArsaker}
          avvisningsAarsakerForFeature={[null]}
          behandlingPaaVent={false}
          behandlingStatusKode="UTRED"
          previewVedtakCallback={forhandsvisVedtaksbrevFunc}
          finishKlageCallback={forhandsvisVedtaksbrevFunc}
          aksjonspunktKoder={[]}
          åpneAksjonspunktKoder={[]}
          klageVurdering={{ klageVurderingResultatNFP }}
          klageresultat={klageVurderingResultatNFP}
          isBehandlingReadOnly
        />
      </KodeverkProvider>,
      { messages },
    );
    expect(screen.getByText('Årsak til avvisning')).toBeInTheDocument();
    expect(screen.getByText('Bruker har klaget for sent')).toBeInTheDocument();
    expect(screen.getByText('Klager er ikke part')).toBeInTheDocument();
  });

  describe('Klage vedtak Selectors', () => {
    describe('getIsAvvist', () => {
      it('should return true', () => {
        const brt = { klageVurdering: 'AVVIS_KLAGE' };
        const selected = getIsAvvist.resultFunc(brt);
        expect(selected).equal(true);
      });
    });

    describe('getIsAvgetAvvisningsAarsakervist', () => {
      it('should return avvisningsAarsaker with length 2', () => {
        const klageVurdering = {
          klageFormkravResultatNFP: { avvistArsaker: [{ navn: 'arsak1' }, { navn: 'arsak2' }] },
          klageVurderingResultatNFP: { klageAvvistArsakNavn: 'Klager er ikke part' },
        };
        const selected = getAvvisningsAarsaker.resultFunc(klageVurdering);
        expect(selected).toHaveLength(2);
      });
    });

    describe('getKlageresultat', () => {
      it('Skal returnere klageVurderingResultatNFP hvis klagen ikke har blitt vurdert av klageinstans', () => {
        const klageVurderingResultatNFP = { klageVurdertAv: 'NAY' };
        const klageresultater = { klageVurderingResultatNFP };
        const resultat = getKlageresultat.resultFunc(klageresultater);
        expect(resultat).equal(klageVurderingResultatNFP);
      });

      it('Skal returnere klageVurderingResultatNK hvis klagen har blitt vurdert av klageinstans', () => {
        const klageVurderingResultatNFP = { klageVurdertAv: 'NAY' };
        const klageVurderingResultatNK = { klageVurdertAv: 'NK' };
        const klageresultater = { klageVurderingResultatNFP, klageVurderingResultatNK };
        const resultat = getKlageresultat.resultFunc(klageresultater);
        expect(resultat).equal(klageVurderingResultatNK);
      });
    });
  });
});
