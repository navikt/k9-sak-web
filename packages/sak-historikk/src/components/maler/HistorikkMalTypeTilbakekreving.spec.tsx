import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { Historikkinnslag, HistorikkinnslagDel } from '@k9-sak-web/types';
import { screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';
import messages from '../../../i18n/nb_NO.json';
import historikkEndretFeltType from '../../kodeverk/historikkEndretFeltType';
import historikkOpplysningTypeCodes from '../../kodeverk/historikkOpplysningTypeCodes';
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
          },
          {
            opplysningType: historikkOpplysningTypeCodes.TILBAKEKREVING_OPPFYLT_BEGRUNNELSE.kode,
          },
          {
            opplysningType: historikkOpplysningTypeCodes.SÆRLIG_GRUNNER_BEGRUNNELSE.kode,
          },
        ],
      },
    ] as HistorikkinnslagDel[];

    const kodeverkNavnFraKodeFn = kode => {
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

    renderWithIntl(
      <MemoryRouter>
        <HistorikkMalTypeTilbakekreving
          historikkinnslag={{ historikkinnslagDeler } as Historikkinnslag}
          behandlingLocation={locationMock}
          kodeverkNavnFraKodeFn={kodeverkNavnFraKodeFn}
          createLocationForSkjermlenke={() => locationMock}
          erTilbakekreving={false}
          saksnummer="123"
        />
      </MemoryRouter>,
      { messages },
    );

    expect(
      screen.getAllByText((_, element) => element.textContent === 'Vurdering av perioden 10.10.2018-.')[0],
    ).toBeInTheDocument();

    expect(
      screen.getAllByText((_, element) => element.textContent === 'testing endret fra gammel verdi til ny verdi')[0],
    ).toBeInTheDocument();

    expect(
      screen.getAllByText((_, element) => element.textContent === 'testing 2 er satt til ny verdi 2.')[0],
    ).toBeInTheDocument();
  });
});
