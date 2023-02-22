import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';

import { omit } from '@fpsak-frontend/utils';
import { Historikkinnslag, HistorikkinnslagDel } from '@k9-sak-web/types';

import historikkOpplysningTypeCodes from '../../kodeverk/historikkOpplysningTypeCodes';
import HistorikkMalTypeForeldelse from './HistorikkMalTypeForeldelse';

describe('HistorikkMalTypeForeldelse', () => {
  it('skal vise alle historikkelement korrekt', () => {
    const historikkinnslagDeler = [
      {
        skjermlenke: {
          kode: 'FORELDELSE',
        },
        endredeFelter: [
          {
            endretFeltNavn: {
              kode: 'feltkode',
            },
            fraVerdi: 'gammel verdi',
            tilVerdi: 'ny verdi',
          },
          {
            endretFeltNavn: {
              kode: 'Anna feltkode',
            },
            tilVerdi: 'ny verdi 2',
          },
        ],
        opplysninger: [
          {
            opplysningType: {
              kode: historikkOpplysningTypeCodes.PERIODE_FOM.kode,
              kodeverk: '',
            },
            tilVerdi: '10.10.2018',
          },
          {
            opplysningType: {
              kode: historikkOpplysningTypeCodes.PERIODE_TOM.kode,
              tilVerdi: '10.12.2018',
            },
          },
        ],
      },
    ] as HistorikkinnslagDel[];

    const getKodeverknavn = kodeverk => {
      if (kodeverk.kode === 'feltkode') {
        return 'testing';
      }
      if (kodeverk.kode === 'Anna feltkode') {
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
      <HistorikkMalTypeForeldelse
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
