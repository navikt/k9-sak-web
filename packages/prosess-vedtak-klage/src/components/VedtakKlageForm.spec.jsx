import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';

import React from 'react';
import { intlMock } from '../../i18n';
import messages from '../../i18n/nb_NO.json';
import { VedtakKlageFormImpl, getAvvisningsAarsaker, getIsAvvist, getKlageresultat } from './VedtakKlageForm';

const KLAGE_OMGJORT_TEKST = 'VedtakKlageForm.KlageOmgjortGunst';

describe('<VedtakKlageForm>', () => {
  it('skal vise riktige avvisningsårsaker', () => {
    const avvistArsaker = [
      { kode: 'KLAGET_FOR_SENT', kodeverk: 'KLAGE_AVVIST_AARSAK' },
      { kode: 'KLAGER_IKKE_PART', kodeverk: 'KLAGE_AVVIST_AARSAK' },
    ];
    const forhandsvisVedtaksbrevFunc = vi.fn();
    const klageVurderingResultatNFP = {
      klageVurdertAv: 'NAY',
      klageVurdering: 'AVVIS_KLAGE',
    };
    renderWithIntl(
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
        behandlingPåVent={false}
        behandlingStatusKode="UTRED"
        previewVedtakCallback={forhandsvisVedtaksbrevFunc}
        finishKlageCallback={forhandsvisVedtaksbrevFunc}
        aksjonspunktKoder={[]}
        åpneAksjonspunktKoder={[]}
        klageVurdering={{ klageVurderingResultatNFP }}
        klageresultat={klageVurderingResultatNFP}
        isBehandlingReadOnly
        alleKodeverk={{
          KlageAvvistÅrsak: [
            {
              kode: 'KLAGET_FOR_SENT',
              navn: 'Bruker har klaget for sent',
              kodeverk: 'KLAGE_AVVIST_AARSAK',
            },
            {
              kode: 'KLAGER_IKKE_PART',
              navn: 'Klager er ikke part',
              kodeverk: 'KLAGE_AVVIST_AARSAK',
            },
          ],
        }}
      />,
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
