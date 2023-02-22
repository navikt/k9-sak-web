import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { getAvvisningsAarsaker, getIsAvvist, getKlageresultat, VedtakKlageFormImpl } from './VedtakKlageForm';
import { mountWithIntl, intlMock } from '../../i18n';

const KLAGE_OMGJORT_TEKST = 'VedtakKlageForm.KlageOmgjortGunst';

describe('<VedtakKlageForm>', () => {
  it('skal vise riktige avvisningsårsaker', () => {
    const avvistArsaker = [
      { kode: 'KLAGET_FOR_SENT', kodeverk: 'KLAGE_AVVIST_AARSAK' },
      { kode: 'KLAGER_IKKE_PART', kodeverk: 'KLAGE_AVVIST_AARSAK' },
    ];
    const forhandsvisVedtaksbrevFunc = sinon.spy();
    const klageVurderingResultatNFP = {
      klageVurdertAv: 'NAY',
      klageVurdering: 'AVVIS_KLAGE',
    };
    const wrapper = mountWithIntl(
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
    );
    expect(wrapper.find(Undertekst).at(1).childAt(0).text()).equal('Årsak til avvisning');
    expect(wrapper.find(Normaltekst).at(1).childAt(0).text()).equal('Bruker har klaget for sent');
    expect(wrapper.find(Normaltekst).at(2).childAt(0).text()).equal('Klager er ikke part');
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
        expect(selected).to.have.length(2);
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
