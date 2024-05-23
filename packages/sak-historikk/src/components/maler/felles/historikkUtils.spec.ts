import { intlWithMessages } from '@fpsak-frontend/utils-test/intl-test-helper';
import { getKodeverkNavnFraKodeFnMock } from '@k9-sak-web/lib/kodeverk/mocks/kodeverkNavnFraKodeMock.js';

import messages from '../../../../i18n/nb_NO.json';
import { findResultatText } from './historikkUtils';

const intlMock = intlWithMessages(messages);

const noenKodeverk = {
  VedtakResultatType: [
    {
      kode: 'VEDTAK_I_KLAGEBEHANDLING',
      navn: 'vedtak i klagebehandling',
      kodeverk: 'VEDTAK_RESULTAT_TYPE',
    },
  ],
  HistorikkResultatType: [
    {
      kode: 'KLAGE_HJEMSENDE_UTEN_OPPHEVE',
      navn: 'Behandling er hjemsendt',
      kodeverk: 'HISTORIKK_RESULTAT_TYPE',
    },
    {
      kode: 'FULL_TILBAKEBETALING',
      navn: 'Full tilbakebetaling',
      kodeverk: 'VEDTAK_RESULTAT_TYPE',
    },
  ],
};

describe('historikkUtils', () => {
  it('findResultatText henter navn fra alle kodeverk, med fallback for tilbakekrevingskoder', () => {
    const historikkResultatNavn = findResultatText(
      noenKodeverk.HistorikkResultatType[0].kode,
      intlMock,
      getKodeverkNavnFraKodeFnMock(noenKodeverk),
    );
    expect(historikkResultatNavn).toEqual(noenKodeverk.HistorikkResultatType[0].navn);

    const vedtakResultatNavn = findResultatText(
      noenKodeverk.VedtakResultatType[0].kode,
      intlMock,
      getKodeverkNavnFraKodeFnMock(noenKodeverk),
    );
    expect(vedtakResultatNavn).toEqual(noenKodeverk.VedtakResultatType[0].navn);
  });

  it('findResultatText har fallback for tilbekekrevingskoder', () => {
    const historikkResultatNavn = findResultatText(
      'FULL_TILBAKEBETALING',
      intlMock,
      getKodeverkNavnFraKodeFnMock(noenKodeverk),
    );
    expect(historikkResultatNavn).toEqual('Full tilbakebetaling');
  });
});
