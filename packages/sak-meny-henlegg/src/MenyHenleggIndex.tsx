import React, { useCallback, useState } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { ArbeidsgiverOpplysningerPerId, Kodeverk, KodeverkMedNavn, Personopplysninger } from '@k9-sak-web/types';

import KlagePart from '@k9-sak-web/behandling-klage/src/types/klagePartTsType';
import { safeJSONParse } from '@fpsak-frontend/utils';
import HenleggBehandlingModal from './components/HenleggBehandlingModal';
import HenlagtBehandlingModal from './components/HenlagtBehandlingModal';

import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

export const getMenytekst = (): string => intl.formatMessage({ id: 'MenyHenleggIndex.HenleggBehandling' });

interface OwnProps {
  behandlingId?: number;
  behandlingVersjon?: number;
  henleggBehandling: (params: {
    behandlingVersjon: number;
    behandlingId: number;
    årsakKode: string;
    begrunnelse: string;
  }) => Promise<any>;
  forhandsvisHenleggBehandling: (erHenleggelse: boolean, data: any) => void;
  ytelseType: Kodeverk;
  behandlingType: Kodeverk;
  behandlingUuid: string;
  behandlingResultatTyper: KodeverkMedNavn[];
  gaaTilSokeside: () => void;
  lukkModal: () => void;
  personopplysninger?: Personopplysninger;
  arbeidsgiverOpplysningerPerId?: ArbeidsgiverOpplysningerPerId;
  hentMottakere: () => Promise<KlagePart[]>;
}

const MenyHenleggIndex = ({
  behandlingId,
  behandlingVersjon,
  henleggBehandling,
  forhandsvisHenleggBehandling,
  ytelseType,
  behandlingType,
  behandlingUuid,
  behandlingResultatTyper,
  gaaTilSokeside,
  lukkModal,
  personopplysninger,
  arbeidsgiverOpplysningerPerId,
  hentMottakere,
}: OwnProps) => {
  const [erHenlagt, setHenlagt] = useState(false);

  const submit = useCallback(
    formValues => {
      const henleggBehandlingDto = {
        behandlingVersjon,
        behandlingId,
        årsakKode: formValues.årsakKode,
        begrunnelse: formValues.begrunnelse,
        fritekst: formValues.fritekst,
        valgtMottaker: safeJSONParse(formValues.valgtMottaker),
      };
      henleggBehandling(henleggBehandlingDto).then(() => {
        setHenlagt(true);
      });
    },
    [behandlingId, behandlingVersjon],
  );

  return (
    <RawIntlProvider value={intl}>
      {!erHenlagt && (
        <HenleggBehandlingModal
          // @ts-ignore Fiks denne
          onSubmit={submit}
          cancelEvent={lukkModal}
          previewHenleggBehandling={forhandsvisHenleggBehandling}
          behandlingId={behandlingId}
          ytelseType={ytelseType}
          behandlingType={behandlingType}
          behandlingUuid={behandlingUuid}
          behandlingResultatTyper={behandlingResultatTyper}
          personopplysninger={personopplysninger}
          arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
          hentMottakere={hentMottakere}
        />
      )}
      {erHenlagt && <HenlagtBehandlingModal showModal closeEvent={gaaTilSokeside} />}
    </RawIntlProvider>
  );
};

export default MenyHenleggIndex;
