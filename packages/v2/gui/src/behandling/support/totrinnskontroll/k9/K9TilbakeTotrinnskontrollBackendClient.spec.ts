import { describe, expect, it } from 'vitest';
import type { K9TilbakeTotrinnskontrollSkjermlenkeContextDtoAdjusted } from '@k9-sak-web/backend/combined/kontrakt/vedtak/TotrinnskontrollSkjermlenkeContextDto.js';
import { K9TilbakeTotrinnskontrollData } from './K9TilbakeTotrinnskontrollBackendClient.js';
import { K9TilbakeKodeverkoppslag } from '../../../../kodeverk/oppslag/K9TilbakeKodeverkoppslag.js';
import { oppslagKodeverkSomObjektK9Tilbake } from '../../../../kodeverk/mocks/oppslagKodeverkSomObjektK9Tilbake.js';

describe('K9TilbakeTotrinnskontrollData', () => {
  it('should sort and filter input dtos', () => {
    const dto1: K9TilbakeTotrinnskontrollSkjermlenkeContextDtoAdjusted = {
      skjermlenkeType: 'TILBAKEKREVING',
      totrinnskontrollAksjonspunkter: [{ aksjonspunktKode: '5002' }, { aksjonspunktKode: '5004' }],
    };
    const dto2: K9TilbakeTotrinnskontrollSkjermlenkeContextDtoAdjusted = {
      skjermlenkeType: 'FAKTA_OM_FEILUTBETALING',
      totrinnskontrollAksjonspunkter: [{ aksjonspunktKode: '7001' }],
    } as const;
    const inpDtos: K9TilbakeTotrinnskontrollSkjermlenkeContextDtoAdjusted[] = [dto1, dto2];

    const data = new K9TilbakeTotrinnskontrollData(
      inpDtos,
      new K9TilbakeKodeverkoppslag(oppslagKodeverkSomObjektK9Tilbake),
    );
    const expectedDtos = [dto2, dto1];
    expect(data.dtos).toEqual(expectedDtos);
  });
});
