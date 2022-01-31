import React from 'react';
import { Periode } from '@k9-sak-web/types';
import { DateLabel, Image } from '@fpsak-frontend/shared-components';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import advarselImg from '@fpsak-frontend/assets/images/advarsel-circle.svg';
import avslaattImg from '@fpsak-frontend/assets/images/avslaatt_valgt.svg';
import innvilgetImg from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { FormattedMessage } from 'react-intl';

export const getFormattedPerioder = (søknadsperioder: Periode[]) =>
  søknadsperioder?.map((periode, index) => (
    <React.Fragment key={`${periode.fom}_${periode.tom}`}>
      {index > 0 && ', '}
      <DateLabel dateString={periode.fom} />
      {` - `}
      <DateLabel dateString={periode.tom} />
    </React.Fragment>
  ));

export const getStatusIcon = (behandlingsresultatTypeKode: string, className: string) => {
  if (behandlingsresultatTypeKode === behandlingResultatType.INNVILGET) {
    return (
      <Image
        className={className}
        src={innvilgetImg}
        tooltip={<FormattedMessage id="BehandlingPickerItemContent.Behandling.Innvilget" />}
        alignTooltipLeft
      />
    );
  }

  if (behandlingsresultatTypeKode === behandlingResultatType.AVSLATT) {
    return (
      <Image
        className={className}
        src={avslaattImg}
        tooltip={<FormattedMessage id="BehandlingPickerItemContent.Behandling.Avslaatt" />}
        alignTooltipLeft
      />
    );
  }

  if (behandlingsresultatTypeKode === behandlingResultatType.IKKE_FASTSATT) {
    return (
      <Image
        className={className}
        src={advarselImg}
        tooltip={<FormattedMessage id="BehandlingPickerItemContent.Behandling.UnderBehandling" />}
        alignTooltipLeft
      />
    );
  }

  return null;
};
