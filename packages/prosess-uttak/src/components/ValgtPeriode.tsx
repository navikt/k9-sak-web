import React, { FunctionComponent } from 'react';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { FormattedMessage, useIntl } from 'react-intl';
import moment from 'moment';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import BehandlingPersonMap from './types/BehandlingPersonMap';
import UttakTidslinjePeriode from './types/UttakTidslinjePeriode';
import { UtfallEnum } from './types/Utfall';

interface ValgtPeriodeProps {
  behandlingPersonMap: BehandlingPersonMap;
  valgtPeriode: UttakTidslinjePeriode;
}

const ValgtPeriode: FunctionComponent<ValgtPeriodeProps> = ({ behandlingPersonMap, valgtPeriode }) => {
  const { periodeinfo } = valgtPeriode;
  const intl = useIntl();

  if (periodeinfo.utfall === UtfallEnum.INNVILGET) {
    return (
      <>
        <Undertittel>
          <FormattedMessage id="UttakPanel.ValgtPeriode" />
        </Undertittel>
        <Normaltekst>{`Fødselsnummer: ${behandlingPersonMap[valgtPeriode.periodeinfo.behandlingsId].fnr}`}</Normaltekst>
        <Normaltekst>
          <FormattedMessage
            id="UttakPanel.FOM"
            values={{ fom: moment(valgtPeriode.fom).format(DDMMYYYY_DATE_FORMAT) }}
          />
        </Normaltekst>
        <Normaltekst>
          <FormattedMessage
            id="UttakPanel.TOM"
            values={{ tom: moment(valgtPeriode.tom).format(DDMMYYYY_DATE_FORMAT) }}
          />
        </Normaltekst>
        <Normaltekst>
          <FormattedMessage id="UttakPanel.GraderingProsent" values={{ grad: valgtPeriode.periodeinfo.grad }} />
        </Normaltekst>
        <Normaltekst>{intl.formatMessage({ id: 'UttakPanel.UtfallInnvilget' })}</Normaltekst>
        {valgtPeriode.periodeinfo.årsak && <Normaltekst>{`Årsak: ${valgtPeriode.periodeinfo.årsak}`}</Normaltekst>}
      </>
    );
  }

  const { årsaker } = periodeinfo;
  return (
    <>
      <Undertittel>
        <FormattedMessage id="UttakPanel.ValgtPeriode" />
      </Undertittel>
      <Normaltekst>{`Fødselsnummer: ${behandlingPersonMap[valgtPeriode.periodeinfo.behandlingsId].fnr}`}</Normaltekst>
      <Normaltekst>
        <FormattedMessage id="UttakPanel.FOM" values={{ fom: moment(valgtPeriode.fom).format(DDMMYYYY_DATE_FORMAT) }} />
      </Normaltekst>
      <Normaltekst>
        <FormattedMessage id="UttakPanel.TOM" values={{ tom: moment(valgtPeriode.tom).format(DDMMYYYY_DATE_FORMAT) }} />
      </Normaltekst>
      <Normaltekst>{intl.formatMessage({ id: 'UttakPanel.UtfallAvslått' })}</Normaltekst>
      {årsaker?.map(({ årsak }, index) => (
        <Normaltekst key={årsak}>{`Årsak ${index + 1}: ${årsak}`}</Normaltekst>
      ))}
    </>
  );
};

export default ValgtPeriode;
