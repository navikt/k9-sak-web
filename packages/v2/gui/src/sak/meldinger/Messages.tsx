import { useEffect, useRef, useState, useReducer } from 'react';
import { Button, Checkbox, HStack, Spacer, VStack } from '@navikt/ds-react';
import type { Template } from '@k9-sak-web/backend/k9formidling/models/Template.js';
import type { FritekstbrevDokumentdata } from '@k9-sak-web/backend/k9formidling/models/FritekstbrevDokumentdata.js';
import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { FileSearchIcon, PaperplaneIcon } from '@navikt/aksel-icons';
import type { BestillBrevDto, MottakerDto, FritekstbrevinnholdDto } from '@k9-sak-web/backend/k9sak/generated';
import type { ForhåndsvisDto } from '@k9-sak-web/backend/k9formidling/models/ForhåndsvisDto.js';
import type { AvsenderApplikasjon } from '@k9-sak-web/backend/k9formidling/models/AvsenderApplikasjon.js';
import {
  type ArbeidsgiverOpplysningerPerId,
  bestemAvsenderApp,
  type Personopplysninger,
} from '../../utils/formidling.js';
import TredjepartsmottakerInput, {
  type BackendApi as TredjepartsmottakerBackendApi,
  type TredjepartsmottakerError,
  type TredjepartsmottakerValue,
} from './TredjepartsmottakerInput.js';
import MottakerSelect from './MottakerSelect.js';
import FritekstForslagSelect from './FritekstForslagSelect.js';
import FritekstInput, {
  type FritekstInputInvalid,
  type FritekstInputMethods,
  type FritekstInputValue,
  type FritekstModus,
} from './FritekstInput.js';
import MalSelect from './MalSelect.jsx';
import type { BehandlingInfo } from '../BehandlingInfo.js';
import type { Fagsak } from '../Fagsak.js';
import type { Mottaker } from '@k9-sak-web/backend/k9formidling/models/Mottaker.js';

export interface BackendApi extends TredjepartsmottakerBackendApi {
  hentInnholdBrevmal(
    fagsakYtelsestype: FagsakYtelsesType,
    eksternReferanse: string,
    avsenderApplikasjon: AvsenderApplikasjon,
    maltype: string,
  ): Promise<FritekstbrevDokumentdata[]>;
  bestillDokument(bestilling: BestillBrevDto): Promise<void>;
  lagForhåndsvisningPdf(data: ForhåndsvisDto): Promise<Blob>;
}

type MessagesProps = {
  readonly maler: Template[];
  readonly fagsak: Fagsak;
  readonly behandling: BehandlingInfo;
  readonly personopplysninger?: Personopplysninger;
  readonly arbeidsgiverOpplysningerPerId?: ArbeidsgiverOpplysningerPerId;
  readonly api: BackendApi;
  readonly onMessageSent: () => void;
};

type MessagesState = Readonly<{
  valgtMalkode: string | undefined;
  fritekstForslag: FritekstbrevDokumentdata[];
  valgtFritekst: FritekstbrevDokumentdata | undefined;
  valgtMottaker: Mottaker | undefined;
  tredjepartsmottakerAktivert: boolean;
  tredjepartsmottaker: TredjepartsmottakerValue | TredjepartsmottakerError | undefined;
}>;

type SetValgtMalkode = Readonly<{
  type: 'SettValgtMal';
  malkode: string | undefined;
}>;

type SetFritekstForslag = Readonly<{
  type: 'SettFritekstForslag';
  fritekstForslag: FritekstbrevDokumentdata[];
}>;

type SetValgtFritekst = Readonly<{
  type: 'SettValgtFritekst';
  valgtFritekst: FritekstbrevDokumentdata | undefined;
}>;

type SetValgtMottaker = Readonly<{
  type: 'SettValgtMottaker';
  valgtMottaker: Mottaker | undefined;
}>;

type SetTredjepartsmottakerAktivert = Readonly<{
  type: 'SettTredjepartsmottakerAktivert';
  tredjepartsmottakerAktivert: boolean;
}>;

type SetTredjepartsmottaker = Readonly<{
  type: 'SettTredjepartsmottaker';
  tredjepartsmottaker: TredjepartsmottakerValue | TredjepartsmottakerError | undefined;
}>;

type OnValgtMalChanged = Readonly<{
  type: 'OnValgtMalChanged';
  valgtMal: Template | undefined;
}>;

type MessagesStateActions =
  | SetValgtMalkode
  | SetFritekstForslag
  | SetValgtFritekst
  | SetValgtMottaker
  | SetTredjepartsmottakerAktivert
  | SetTredjepartsmottaker
  | OnValgtMalChanged;

// eslint-disable-next-line consistent-return -- Bevisst deaktivert, ts sjekker at alle mulige typer fører til return.
const messagesStateReducer = (state: MessagesState, dispatch: MessagesStateActions): MessagesState => {
  // eslint-disable-next-line default-case -- Bevisst deaktivert for å få TS sjekk på at alle dispatch.type verdier er handtert
  switch (dispatch.type) {
    case 'OnValgtMalChanged': {
      // Når valgt mal har blitt endra, endre tredjepartsmottakerAktivert og valgtMottakerId i henhold.
      const tredjepartsmottakerAktivert =
        state.tredjepartsmottakerAktivert && (dispatch.valgtMal?.støtterTredjepartsmottaker || false);
      // Velg første tilgjengelige mottaker for valgt mal, eller første utilgjengelige mottaker viss ingen er tilgjengelige.
      const valgtMottaker =
        dispatch.valgtMal?.mottakere.find(m => m.utilgjengelig === undefined) || dispatch.valgtMal?.mottakere[0];
      return {
        ...state,
        tredjepartsmottakerAktivert,
        valgtMottaker,
      };
    }
    case 'SettValgtMal': {
      const valgtMalkode = dispatch.malkode;
      return {
        ...state,
        valgtMalkode,
      };
    }
    // Når fritekstForslag blir satt skal valgtFritekst settast til innhald i første forslag
    case 'SettFritekstForslag': {
      const { fritekstForslag } = dispatch;
      const valgtFritekst = fritekstForslag[0];
      return {
        ...state,
        fritekstForslag,
        valgtFritekst,
      };
    }
    case 'SettValgtFritekst': {
      const { valgtFritekst } = dispatch;
      return {
        ...state,
        valgtFritekst,
      };
    }
    case 'SettValgtMottaker': {
      const { valgtMottaker } = dispatch;
      return {
        ...state,
        valgtMottaker,
      };
    }
    case 'SettTredjepartsmottakerAktivert': {
      const { tredjepartsmottakerAktivert } = dispatch;
      return {
        ...state,
        tredjepartsmottakerAktivert,
      };
    }
    case 'SettTredjepartsmottaker': {
      const { tredjepartsmottaker } = dispatch;
      return {
        ...state,
        tredjepartsmottaker,
      };
    }
  }
};

const initMessagesState = (maler: Template[]): MessagesState => ({
  valgtMalkode: maler[0]?.kode,
  fritekstForslag: [],
  valgtFritekst: undefined,
  valgtMottaker: undefined,
  tredjepartsmottakerAktivert: false,
  tredjepartsmottaker: undefined,
});

const Messages = ({
  maler,
  fagsak,
  behandling,
  personopplysninger,
  arbeidsgiverOpplysningerPerId,
  api,
  onMessageSent,
}: MessagesProps) => {
  const [
    { valgtMalkode, fritekstForslag, valgtFritekst, valgtMottaker, tredjepartsmottakerAktivert, tredjepartsmottaker },
    dispatch,
  ] = useReducer(messagesStateReducer, initMessagesState(maler));
  const fritekstInputRef = useRef<FritekstInputMethods>(null);
  // showValidation is set to true when inputs should display any validation errors, i.e. after the user tries to submit the form without having valid values.
  const [showValidation, setShowValidation] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const setValgtMalkode = (malkode: string | undefined) => dispatch({ type: 'SettValgtMal', malkode });
  const setFritekstForslag = (newFritekstForslag: FritekstbrevDokumentdata[]) =>
    dispatch({ type: 'SettFritekstForslag', fritekstForslag: newFritekstForslag });
  const setValgtFritekst = (newValgtFritekst: FritekstbrevDokumentdata | undefined) =>
    dispatch({ type: 'SettValgtFritekst', valgtFritekst: newValgtFritekst });
  const setValgtMottaker = (newValgtMottaker: Mottaker | undefined) =>
    dispatch({ type: 'SettValgtMottaker', valgtMottaker: newValgtMottaker });
  const setTredjepartsmottakerAktivert = (newTredjepartsmottakerAktivert: boolean) =>
    dispatch({ type: 'SettTredjepartsmottakerAktivert', tredjepartsmottakerAktivert: newTredjepartsmottakerAktivert });
  const setTredjepartsmottaker = (
    newTredjepartsmottaker: TredjepartsmottakerValue | TredjepartsmottakerError | undefined,
  ) => dispatch({ type: 'SettTredjepartsmottaker', tredjepartsmottaker: newTredjepartsmottaker });
  const onValgtMalChanged = (newValgtMal: Template | undefined) =>
    dispatch({ type: 'OnValgtMalChanged', valgtMal: newValgtMal });

  // Konverter valgtFritekst til FritekstInputValue
  const valgtFritekstInputValue: FritekstInputValue = {
    tittel: valgtFritekst?.tittel,
    tekst: valgtFritekst?.fritekst,
  };
  // Når evt fritekst forslag blir valgt, sett inn verdien i fritekst feltet.
  useEffect(() => {
    fritekstInputRef.current?.setValue(valgtFritekstInputValue);
  }, [valgtFritekst]);

  // Last evt fritekst forslag når mal blir valgt
  useEffect(() => {
    const loadFritekstForslag = async () => {
      if (valgtMalkode !== undefined) {
        const innhold = await api.hentInnholdBrevmal(
          fagsak.sakstype.kode,
          behandling.uuid,
          bestemAvsenderApp(behandling.type.kode),
          valgtMalkode,
        );
        setFritekstForslag(innhold);
      }
    };
    loadFritekstForslag();
  }, [valgtMalkode, fagsak, behandling]);

  const valgtMal = maler.find(mal => mal.kode === valgtMalkode);
  useEffect(() => {
    onValgtMalChanged(valgtMal);
  }, [valgtMal]);

  const fritekstModus: FritekstModus = valgtMal?.støtterTittelOgFritekst ? 'StørreFritekstOgTittel' : 'EnkelFritekst';

  const showFritekstInput = (valgtMal?.støtterFritekst || valgtMal?.støtterTittelOgFritekst) ?? false;

  // FritekstbrevinnholdDto must be undefined or have props set with string value
  const resolveFritekstbrevinnholdDto = (
    fritekstInputValue: FritekstInputValue | FritekstInputInvalid | undefined,
  ): FritekstbrevinnholdDto | undefined => {
    if (
      fritekstModus === 'StørreFritekstOgTittel' &&
      fritekstInputValue?.tittel !== undefined &&
      fritekstInputValue?.tekst !== undefined
    ) {
      return {
        overskrift: fritekstInputValue.tittel,
        brødtekst: fritekstInputValue.tekst,
      };
    }
    return undefined;
  };

  // overstyrtMottaker skal vere valgt mottaker frå MottakerSelect, viss ikkje sending til tredjepartsmottaker er aktivert.
  // Viss sending til tredjepartsmottaker er aktivert skal den settast til inntasta orgnr.
  // Her konverterast og Mottaker type returnert frå formidling til MottakerDto type som k9-sak server forventa.
  // Når denne returnerer undefined er det ein valideringsfeil i skjemaet (manglande/feil på mottaker definisjon).
  const resolveOvertyrtMottaker = (): MottakerDto | undefined => {
    if (tredjepartsmottakerAktivert) {
      // Må ha gyldig tredjepartsmottaker definert
      if (tredjepartsmottaker?.organisasjonsnr !== undefined) {
        return {
          id: tredjepartsmottaker.organisasjonsnr,
          type: 'ORGNR',
        };
      }

      // Må ha gyldig mottaker valgt i select boks
    } else if (valgtMottaker !== undefined && valgtMottaker.utilgjengelig === undefined) {
      return valgtMottaker;
    }
    // Feil, mangler gyldig mottaker for sending
    return undefined;
  };

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
    const fritekstbrev = resolveFritekstbrevinnholdDto(fritekstInputValue);
    // Ut frå oppførsel til gammal kode ser det ut til at fritekst skal settast når valgt mal ikkje støtter tittel.
    // Ellers skal fritekstbrev prop settast.
    const fritekst = fritekstModus === 'EnkelFritekst' ? fritekstInputValue?.tekst : undefined;

    const overstyrtMottaker = resolveOvertyrtMottaker();
    if (overstyrtMottaker === undefined) {
      return undefined;
    }
    return {
      brevmalkode: valgtMalkode,
      fritekst,
      fritekstbrev,
      overstyrtMottaker,
    };
  };

  const submitHandler = async () => {
    setShowValidation(true);
    const values = validateAndResolveValues();
    if (values !== undefined) {
      const bestillBrevDto: BestillBrevDto = {
        behandlingId: behandling.id,
        brevmalkode: values.brevmalkode,
        fritekst: values.fritekst,
        fritekstbrev: values.fritekstbrev,
        overstyrtMottaker: values.overstyrtMottaker,
        // arsakskode og dokumentbestillingsId props blir ikkje satt her. Ser ikkje ut til at dei er satt i gammal kode.
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
      if (fagsak.person.aktørId !== undefined) {
        // Koden her har store likheter med lagForhåndsvisRequest i formidlingUtils.tsx
        const forhåndsvisDto: ForhåndsvisDto = {
          eksternReferanse: behandling.uuid,
          ytelseType: fagsak.sakstype,
          saksnummer: fagsak.saksnummer,
          overstyrtMottaker: values.overstyrtMottaker,
          dokumentMal: values.brevmalkode,
          dokumentdata: {
            fritekst: values.fritekst ?? '', // For some backend reason fritekst must be defined even if fritekstbrev has the actual content
            fritekstbrev: values.fritekstbrev,
          },
          aktørId: fagsak.person.aktørId,
          avsenderApplikasjon: bestemAvsenderApp(behandling.type.kode),
        };
        const pdfBlob = await api.lagForhåndsvisningPdf(forhåndsvisDto);
        window.open(URL.createObjectURL(pdfBlob));
      } else {
        throw new Error(`fagsak.person.aktørId was undefined. Saksnummer: ${fagsak.saksnummer}`);
      }
    }
    // else: validation failed, error message should be displayed in the input field(s)
  };

  return (
    <VStack gap="4">
      <MalSelect maler={maler} valgtMalkode={valgtMalkode} onChange={setValgtMalkode} />
      <FritekstForslagSelect
        fritekstForslag={fritekstForslag}
        defaultValue={valgtFritekst}
        onChange={setValgtFritekst}
      />
      <MottakerSelect
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        personopplysninger={personopplysninger}
        valgtMal={valgtMal}
        valgtMottakerId={valgtMottaker?.id}
        onChange={setValgtMottaker}
        disabled={tredjepartsmottakerAktivert}
        showValidation={showValidation}
      />
      <Checkbox
        checked={tredjepartsmottakerAktivert}
        onChange={() => setTredjepartsmottakerAktivert(!tredjepartsmottakerAktivert)}
        size="small"
        disabled={!valgtMal?.støtterTredjepartsmottaker}
      >
        Send til tredjepart
      </Checkbox>
      <TredjepartsmottakerInput
        show={tredjepartsmottakerAktivert}
        showValidation={showValidation}
        required
        api={api}
        defaultValue={tredjepartsmottaker?.organisasjonsnr}
        onChange={setTredjepartsmottaker}
      />
      <FritekstInput
        språk={behandling.sprakkode}
        defaultValue={valgtFritekstInputValue}
        ref={fritekstInputRef}
        show={showFritekstInput}
        fritekstModus={fritekstModus}
        showValidation={showValidation}
      />
      <HStack gap="3">
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

export default Messages;
