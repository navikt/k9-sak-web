import { useCallback, useState } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { ArbeidsgiverOpplysningerPerId, Kodeverk, KodeverkMedNavn, Personopplysninger } from '@k9-sak-web/types';

import { safeJSONParse } from '@fpsak-frontend/utils';
import { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import KlagePart from '@k9-sak-web/behandling-klage/src/types/klagePartTsType';
import HenlagtBehandlingModal from './components/HenlagtBehandlingModal';
import HenleggBehandlingModal from './components/HenleggBehandlingModal';

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
  ytelseType: FagsakYtelsesType;
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
    async formValues => {
      const henleggBehandlingDto = {
        behandlingVersjon,
        behandlingId,
        årsakKode: formValues.årsakKode,
        begrunnelse: formValues.begrunnelse,
        fritekst: formValues.fritekst,
        valgtMottaker: safeJSONParse(formValues.valgtMottaker),
      };
      await henleggBehandling(henleggBehandlingDto);
      setHenlagt(true);
    },
    [behandlingId, behandlingVersjon],
  );

  return (
    <RawIntlProvider value={intl}>
      {!erHenlagt && (
        <HenleggBehandlingModal
          // @ts-expect-error Migrert frå ts-ignore, uvisst kvifor denne trengs
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
