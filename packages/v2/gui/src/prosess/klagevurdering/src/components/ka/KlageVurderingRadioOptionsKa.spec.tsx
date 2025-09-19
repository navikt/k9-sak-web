import { render, screen } from '@testing-library/react';
import { klageVurderingType } from '../KlageVurderingType';
import { KlageVurderingRadioOptionsKa } from './KlageVurderingRadioOptionsKa';

describe('<KlageVurderingRadioOptionsKaImpl>', () => {
  const medholdReasons = [
    { kode: 'NYE_OPPLYSNINGER', navn: 'Nytt faktum', kodeverk: 'KLAGE_MEDHOLD_AARSAK' },
    { kode: 'ULIK_REGELVERKSTOLKNING', navn: 'Feil lovanvendelse', kodeverk: 'KLAGE_MEDHOLD_AARSAK' },
    { kode: 'ULIK_VURDERING', navn: 'Ulik skjønnsvurdering', kodeverk: 'KLAGE_MEDHOLD_AARSAK' },
    { kode: 'PROSESSUELL_FEIL', navn: 'Saksbehandlingsfeil', kodeverk: 'KLAGE_MEDHOLD_AARSAK' },
  ];

  it('skal vise fire options når klage stadfestet', () => {
    render(
      <KlageVurderingRadioOptionsKa
        readOnly={false}
        medholdReasons={medholdReasons}
        klageVurdering={klageVurderingType.STADFESTE_YTELSESVEDTAK}
      />,
    );

    expect(screen.getByRole('radio', { name: 'Stadfest vedtaket' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Omgjør vedtaket' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Hjemsend vedtaket' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Opphev og hjemsend vedtaket' })).toBeInTheDocument();
  });

  it('skal vise syv options når aksjonspunkt er NK og klage medhold', () => {
    render(
      <KlageVurderingRadioOptionsKa
        readOnly={false}
        medholdReasons={medholdReasons}
        klageVurdering={klageVurderingType.MEDHOLD_I_KLAGE}
      />,
    );
    expect(screen.getByRole('radio', { name: 'Stadfest vedtaket' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Omgjør vedtaket' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Hjemsend vedtaket' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Opphev og hjemsend vedtaket' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Til gunst' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Til ugunst' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Delvis omgjør, til gunst' })).toBeInTheDocument();
  });

  it('skal vise selectfield når klagevurdering er omgjort vedtak', () => {
    render(
      <KlageVurderingRadioOptionsKa
        readOnly={false}
        medholdReasons={medholdReasons}
        klageVurdering={klageVurderingType.MEDHOLD_I_KLAGE}
      />,
    );

    expect(screen.getByRole('combobox', { name: 'Årsak' })).toBeInTheDocument();
  });

  it('skal ikke vise selectfield når klagevurdering er opphev vedtak', () => {
    render(
      <KlageVurderingRadioOptionsKa
        readOnly={false}
        medholdReasons={medholdReasons}
        klageVurdering={klageVurderingType.STADFESTE_YTELSESVEDTAK}
      />,
    );
    expect(screen.queryByRole('combobox', { name: 'Årsak' })).not.toBeInTheDocument();
  });
});
