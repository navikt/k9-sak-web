import { FileSearchIcon, PaperplaneIcon } from '@navikt/aksel-icons';
import { Button, HStack, Select, Spacer, VStack } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { StickyStateReducer } from '@k9-sak-web/gui/utils/StickyStateReducer.js';
import type { BehandlingInfo } from '../../BehandlingInfo.js';
import type { Fagsak } from '../../Fagsak.js';
import FritekstInput, {
  type Error,
  type FritekstInputMethods,
  type FritekstModus,
  type Valid,
} from '../FritekstInput.js';
import type { TilbakeMeldingerApi, TilbakeBestillBrevDto as BestillBrevDto } from './api/TilbakeMeldingerApi.ts';
import type { BrevmalDto } from '@k9-sak-web/backend/combined/tilbakekreving/dokumentbestilling/BrevmalDto.js';

export type TilbakeMessagesProps = {
  readonly maler: BrevmalDto[];
  readonly fagsak: Fagsak;
  readonly behandling: BehandlingInfo;
  readonly api: TilbakeMeldingerApi;
  readonly onMessageSent: () => void;
  readonly stickyState: {
    readonly valgtMalkode: StickyStateReducer<string | undefined>;
    readonly fritekst: {
      readonly tittel: StickyStateReducer<Valid | Error>;
      readonly tekst: StickyStateReducer<Valid | Error>;
    };
  };
};

type SetValgtMalkode = Readonly<{
  type: 'SettValgtMal';
  malkode: string | undefined;
}>;

type Reset = Readonly<{
  type: 'Reset';
  maler: BrevmalDto[];
}>;

type MessagesStateActions = Reset | SetValgtMalkode;

const initValgtMal = (maler: BrevmalDto[]): string | undefined => maler.filter(m => m.tilgjengelig).map(m => m.kode)[0];

// eslint-disable-next-line consistent-return -- Bevisst deaktivert, ts sjekker at alle mulige typer fører til return.
const valgtMalkodeReducer = (_: string | undefined, dispatch: MessagesStateActions): string | undefined => {
  // eslint-disable-next-line default-case -- Bevisst deaktivert for å få TS sjekk på at alle dispatch.type verdier er handtert
  switch (dispatch.type) {
    case 'Reset': {
      // Når input properties endra seg vil vi resette til initial state
      return initValgtMal(dispatch.maler);
    }
    case 'SettValgtMal': {
      return dispatch.malkode;
    }
  }
};

export const TilbakeMessages = ({
  maler,
  fagsak,
  behandling,
  api,
  onMessageSent,
  stickyState,
}: TilbakeMessagesProps) => {
  const [valgtMalkode, dispatch] = stickyState.valgtMalkode.useStickyStateReducer(
    valgtMalkodeReducer,
    initValgtMal(maler),
    `sak-${fagsak.saksnummer}-b-${behandling.id}`,
  );

  const fritekstInputRef = useRef<FritekstInputMethods>(null);
  // showValidation is set to true when inputs should display any validation errors, i.e. after the user tries to submit the form without having valid values.
  const [showValidation, setShowValidation] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const setValgtMalkode = (malkode: string | undefined) => dispatch({ type: 'SettValgtMal', malkode });

  const fritekstModus: FritekstModus = 'EnkelFritekst';

  // Skal returnere undefined når vi ikkje har gyldig tilstand for sending
  const validateAndResolveValues = () => {
    if (valgtMalkode === undefined) {
      return undefined; // Valideringsfeil
    }
    // Hent verdi eller valideringsfeil frå fritekstInput
    const fritekstInputValue = fritekstInputRef.current?.getValue();
    if (fritekstInputValue?.invalid) {
      return undefined;
    }
    // Ut frå oppførsel til gammal kode ser det ut til at fritekst skal settast når valgt mal ikkje støtter tittel.
    // Ellers skal fritekstbrev prop settast.
    const fritekst = fritekstModus === 'EnkelFritekst' ? fritekstInputValue?.tekst : undefined;
    if (fritekst == null) {
      return undefined;
    }

    return {
      brevmalkode: valgtMalkode,
      fritekst,
    };
  };

  const submitHandler = async () => {
    setShowValidation(true);
    const values = validateAndResolveValues();
    if (values !== undefined) {
      const bestillBrevDto: BestillBrevDto = {
        behandlingUuid: behandling.uuid,
        brevmalkode: values.brevmalkode,
        fritekst: values.fritekst,
      };
      try {
        setIsBusy(true);
        await api.bestillDokument(bestillBrevDto);
        // Reset form to initial default values:
        setShowValidation(false);
        setValgtMalkode(maler[0]?.kode);
        fritekstInputRef.current?.reset();
        onMessageSent();
      } finally {
        setIsBusy(false);
      }
    }
    // else: validation failed, error message should be displayed in the input field(s)
  };

  const previewHandler = async () => {
    setShowValidation(true);
    const values = validateAndResolveValues();
    if (values !== undefined) {
      const bestillBrevDto: BestillBrevDto = {
        behandlingUuid: behandling.uuid,
        brevmalkode: values.brevmalkode,
        fritekst: values.fritekst,
      };
      const pdfBlob = await api.lagForhåndsvisningPdf(bestillBrevDto);
      window.open(URL.createObjectURL(pdfBlob));
    }
    // else: validation failed, error message should be displayed in the input field(s)
  };

  return (
    <VStack gap="space-16">
      <Select label="Mal" size="small" value={valgtMalkode} onChange={e => setValgtMalkode(e.target.value)}>
        {maler.map(mal => (
          <option key={mal.kode} value={mal.kode}>
            {mal.navn}
          </option>
        ))}
      </Select>
      <FritekstInput
        språk={behandling.språkkode}
        ref={fritekstInputRef}
        show
        fritekstModus={fritekstModus}
        showValidation={showValidation}
        stickyState={{ ...stickyState.fritekst }}
      />
      <HStack gap="space-12">
        <Button size="small" variant="primary" icon={<PaperplaneIcon />} loading={isBusy} onClick={submitHandler}>
          Send brev
        </Button>
        <Spacer />
        <Button size="small" variant="secondary" icon={<FileSearchIcon />} loading={isBusy} onClick={previewHandler}>
          Forhåndsvis
        </Button>
      </HStack>
    </VStack>
  );
};
