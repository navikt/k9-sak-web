import { renderWithIntl } from '@fpsak-frontend/utils-test/src/test-utils';
import { screen } from '@testing-library/react';
import * as React from 'react';
import SoknadsperioderIndex from './SoknadsperioderIndex';

describe('<SøknadsperioderIndex', () => {
  const data = {
    perioderMedÅrsak: {
      perioderTilVurdering: [{ fom: '2021-12-28', tom: '2022-03-28' }],
      perioderMedÅrsak: [{ periode: { fom: '2021-12-28', tom: '2022-03-28' }, årsaker: ['FØRSTEGANGSVURDERING'] }],
      dokumenterTilBehandling: [
        {
          journalpostId: '22295004',
          innsendingsTidspunkt: '2022-02-22T09:51:10.637',
          type: 'SØKNAD',
          søktePerioder: [
            {
              periode: { fom: '2021-12-28', tom: '2022-03-28' },
              type: null,
              arbeidsgiver: null,
              arbeidsforholdRef: null,
            },
          ],
        },
      ],
    },
    periodeMedUtfall: [
      {
        periode: { fom: '2021-12-28', tom: '2022-01-28' },
        utfall: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
      },
    ],
    forrigeVedtak: [],
  };

  it('skal vise ekspanderknapper for søknader knyttet til perioder', async () => {
    renderWithIntl(<SoknadsperioderIndex behandlingPerioderårsakMedVilkår={data} />);
    expect(await screen.findByRole('button', { name: 'Søknad om ny periode' })).toBeInTheDocument();
  });
});
