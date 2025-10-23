import React from 'react';

import VarselOmRevurderingProsessIndex from '@fpsak-frontend/prosess-varsel-om-revurdering';
import { ProsessDefaultInitPanel } from '@k9-sak-web/gui/behandling/prosess/ProsessDefaultInitPanel.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import type { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';

import { PleiepengerBehandlingApiKeys, restApiPleiepengerHooks } from '../data/pleiepengerBehandlingApi';

/**
 * InitPanel for varsel om revurdering prosesssteg.
 * Wrapper for VarselOmRevurderingProsessIndex som håndterer registrering og datahenting.
 */
export function VarselProsessStegInitPanel() {
  // Hent data ved bruk av eksisterende RequestApi-mønster
  const { data, isLoading } = restApiPleiepengerHooks.useMultipleRestApi<{
    familiehendelse: any;
    familiehendelseOriginalBehandling: any;
    soknadOriginalBehandling: any;
  }>(
    [
      { key: PleiepengerBehandlingApiKeys.FAMILIEHENDELSE },
      { key: PleiepengerBehandlingApiKeys.FAMILIEHENDELSE_ORIGINAL_BEHANDLING },
      { key: PleiepengerBehandlingApiKeys.SOKNAD_ORIGINAL_BEHANDLING },
    ],
    { keepData: true, suspendRequest: false, updateTriggers: [] },
  );

  // Beregn menytype basert på aksjonspunkter
  const getMenuType = (standardProps: any): ProcessMenuStepType => {
    // Hvis det finnes åpne aksjonspunkter, vis warning
    const harApentAksjonspunkt = standardProps.aksjonspunkter?.some(
      (ap: any) => !ap.erAvbrutt && ap.status === 'OPPR',
    );
    return harApentAksjonspunkt ? 'warning' : 'default';
  };

  // Ikke vis panelet hvis data ikke er lastet ennå
  if (isLoading || !data) {
    return null;
  }

  return (
    <ProsessDefaultInitPanel
      urlKode={prosessStegCodes.VARSEL}
      tekstKode="Behandlingspunkt.CheckVarselRevurdering"
      getMenuType={getMenuType}
    >
      {standardProps => (
        <VarselOmRevurderingProsessIndex
          {...standardProps}
          familiehendelse={data.familiehendelse}
          soknad={data.soknadOriginalBehandling}
          soknadOriginalBehandling={data.soknadOriginalBehandling}
          familiehendelseOriginalBehandling={data.familiehendelseOriginalBehandling}
        />
      )}
    </ProsessDefaultInitPanel>
  );
}
