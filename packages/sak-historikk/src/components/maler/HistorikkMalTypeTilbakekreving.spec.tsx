import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';

import { omit } from '@fpsak-frontend/utils';
import { Historikkinnslag, HistorikkinnslagDel } from '@k9-sak-web/types';

import KodeverkType from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import historikkOpplysningTypeCodes from '../../kodeverk/historikkOpplysningTypeCodes';
import historikkEndretFeltType from '../../kodeverk/historikkEndretFeltType';
import HistorikkMalTypeTilbakekreving from './HistorikkMalTypeTilbakekreving';

describe('HistorikkMalTypeTilbakekreving', () => {
  it('skal vise alle historikkelement korrekt', () => {
    const historikkinnslagDeler = [
      {
        skjermlenke: 'TILBAKEKREVING',
        endredeFelter: [
          {
            endretFeltNavn: historikkEndretFeltType.ER_VILKARENE_TILBAKEKREVING_OPPFYLT,
            fraVerdi: 'gammel verdi',
            tilVerdi: 'ny verdi',
          },
          {
            endretFeltNavn: 'Anna feltkode',
            tilVerdi: 'ny verdi 2',
          },
        ],
        opplysninger: [
          {
            opplysningType: historikkOpplysningTypeCodes.PERIODE_FOM.kode,
            tilVerdi: '10.10.2018',
          },
          {
            opplysningType: historikkOpplysningTypeCodes.PERIODE_TOM.kode,
            tilVerdi: '10.12.2018',
          },
          {
            opplysningType: historikkOpplysningTypeCodes.TILBAKEKREVING_OPPFYLT_BEGRUNNELSE.kode,
            tilVerdi: 'test',
          },
          {
            opplysningType: historikkOpplysningTypeCodes.SÆRLIG_GRUNNER_BEGRUNNELSE.kode,
            tilVerdi: 'test',
          },
        ],
      },
    ] as HistorikkinnslagDel[];

    const getKodeverknavn = (kode: string, kodeverk: KodeverkType) => {
      if (kode === historikkEndretFeltType.ER_VILKARENE_TILBAKEKREVING_OPPFYLT) {
        return 'testing';
      }
      if (kode === 'Anna feltkode') {
        return 'testing 2';
      }
      return '';
    };

    const locationMock = {
      pathname: 'test',
      search: 'test',
      state: {},
      hash: 'test',
      key: 'test',
    };

    const wrapper = shallow(
      <HistorikkMalTypeTilbakekreving
        historikkinnslag={{ historikkinnslagDeler } as Historikkinnslag}
        behandlingLocation={locationMock}
        getKodeverknavn={getKodeverknavn}
        createLocationForSkjermlenke={() => locationMock}
        erTilbakekreving={false}
        saksnummer="123"
      />,
    );

    const messages = wrapper.find(FormattedMessage);
    expect(messages).toHaveLength(3);
    expect(omit(messages.at(1).prop('values'), 'b')).toEqual({
      navn: 'testing',
      fraVerdi: 'gammel verdi',
      tilVerdi: 'ny verdi',
    });
    expect(omit(messages.at(2).prop('values'), 'b')).toEqual({
      navn: 'testing 2',
      fraVerdi: undefined,
      tilVerdi: 'ny verdi 2',
    });
  });
});
