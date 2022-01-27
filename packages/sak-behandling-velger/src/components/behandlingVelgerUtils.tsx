import advarselImg from '@fpsak-frontend/assets/images/advarsel-circle.svg';
import avslaattImg from '@fpsak-frontend/assets/images/avslaatt_valgt.svg';
import innvilgetImg from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { DateLabel, Image } from '@fpsak-frontend/shared-components';
import { BehandlingAppKontekst, Periode } from '@k9-sak-web/types';
import moment from 'moment';
import React from 'react';
import { FormattedMessage } from 'react-intl';

export const getFormattedSøknadserioder = (søknadsperioder: Periode[]) =>
  søknadsperioder?.map((periode, index) => {
    if (periode.fom === periode.tom) {
      return (
        <React.Fragment key={periode.fom}>
          {index > 0 && ', '}
          <DateLabel dateString={periode.fom} />
        </React.Fragment>
      );
    }
    return (
      <React.Fragment key={`${periode.fom}_${periode.tom}`}>
        {index > 0 && ', '}
        <DateLabel dateString={periode.fom} />
        {` - `}
        <DateLabel dateString={periode.tom} />
      </React.Fragment>
    );
  });

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

export const sortBehandlinger = (behandlinger: BehandlingAppKontekst[]): BehandlingAppKontekst[] =>
  behandlinger.sort((b1, b2) => {
    if (b1.avsluttet && !b2.avsluttet) {
      return 1;
    }
    if (!b1.avsluttet && b2.avsluttet) {
      return -1;
    }
    if (b1.avsluttet && b2.avsluttet) {
      return moment(b2.avsluttet).diff(moment(b1.avsluttet));
    }
    return moment(b2.opprettet).diff(moment(b1.opprettet));
  });
