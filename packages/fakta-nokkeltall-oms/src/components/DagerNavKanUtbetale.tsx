import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Nøkkeltall from './Nøkkeltall';

interface DagerNavKanUtbetaleProps {
  dagerNavKanUtbetale: number;
  dagerRettPå: number;
  antallDagerArbeidsgiverDekker: number;
  visDetaljer: () => void;
  viserDetaljer: boolean;
}

const DagerNavKanUtbetale: React.FunctionComponent<DagerNavKanUtbetaleProps> = ({
  dagerNavKanUtbetale,
  dagerRettPå,
  antallDagerArbeidsgiverDekker,
  visDetaljer,
  viserDetaljer,
}) => {
  return (
    <Nøkkeltall
      overskrift={{ antallDager: dagerNavKanUtbetale, overskrifttekstId: 'Nøkkeltall.DagerNavKanUtbetale' }}
      detaljer={[
        {
          antallDager: dagerRettPå,
          overskrifttekstId: 'Nøkkeltall.TotaltAntallDager',
          infotekstContent: <FormattedMessage id="Nøkkeltall.TotaltAntallDager.InfoText" />,
        },
        {
          antallDager: -antallDagerArbeidsgiverDekker,
          overskrifttekstId: 'Nøkkeltall.DagerDekketAvArbeidsgiver',
          infotekstContent: (
            <FormattedMessage
              id="Nøkkeltall.DagerDekketAvArbeidsgiver.InfoText"
              values={{ dager: antallDagerArbeidsgiverDekker }}
            />
          ),
        },
      ]}
      farge="#634689"
      viserDetaljer={viserDetaljer}
      visDetaljer={visDetaljer}
    />
  );
};

export default DagerNavKanUtbetale;
