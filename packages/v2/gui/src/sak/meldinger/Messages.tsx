import React, { useEffect, useRef, useState, useReducer } from 'react';
import { Button, Checkbox, HStack, Spacer, VStack } from '@navikt/ds-react';
import type { Template } from '@k9-sak-web/backend/k9formidling/models/Template.js';
import type { FritekstbrevDokumentdata } from '@k9-sak-web/backend/k9formidling/models/FritekstbrevDokumentdata.js';
import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { FileSearchIcon, PaperplaneIcon } from '@navikt/aksel-icons';
import type { BestillBrevDto, MottakerDto, FritekstbrevinnholdDto } from '@k9-sak-web/backend/k9sak/generated';
import type { ForhåndsvisDto } from '@k9-sak-web/backend/k9formidling/models/ForhåndsvisDto.js';
import type { AvsenderApplikasjon } from '@k9-sak-web/backend/k9formidling/models/AvsenderApplikasjon.ts';
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
} from './FritekstInput.js';
import MalSelect from './MalSelect.jsx';
import type { BehandlingInfo } from '../BehandlingInfo.js';
import type { Fagsak } from '../Fagsak.ts';

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
};

type MessagesState = Readonly<{
  valgtMalkode: string | undefined;
  fritekstForslag: FritekstbrevDokumentdata[];
  valgtFritekst: FritekstbrevDokumentdata | undefined;
  valgtMottakerId: string | undefined;
  tredjepartsmottakerAktivert: boolean;
  tredjepartsmottaker: TredjepartsmottakerValue | TredjepartsmottakerError | undefined;
}>

type SetValgtMalkode = Readonly<{
  type: 'SettValgtMal';
  malkode: string | undefined;
}>;

type SetFritekstForslag = Readonly<{
  type: 'SettFritekstForslag',
  fritekstForslag: FritekstbrevDokumentdata[]
}>

type SetValgtFritekst = Readonly<{
  type: 'SettValgtFritekst',
  valgtFritekst: FritekstbrevDokumentdata | undefined,
}>

type SetValgtMottakerId = Readonly<{
  type: 'SettValgtMottakerId',
  valgtMottakerId: string | undefined,
}>

type SetTredjepartsmottakerAktivert = Readonly<{
  type: 'SettTredjepartsmottakerAktivert',
  tredjepartsmottakerAktivert: boolean,
}>

type SetTredjepartsmottaker = Readonly<{
  type: "SettTredjepartsmottaker",
  tredjepartsmottaker: TredjepartsmottakerValue | TredjepartsmottakerError | undefined,
}>

type OnValgtMalChanged = Readonly<{
  type: "OnValgtMalChanged"
  valgtMal: Template | undefined
}>

type MessagesStateActions =
  SetValgtMalkode |
  SetFritekstForslag |
  SetValgtFritekst |
  SetValgtMottakerId |
  SetTredjepartsmottakerAktivert |
  SetTredjepartsmottaker |
  OnValgtMalChanged;

// eslint-disable-next-line consistent-return -- Bevisst deaktivert, ts sjekker at alle mulige typer fører til return.
const messagesStateReducer = (state: MessagesState, dispatch: MessagesStateActions): MessagesState => {
  // eslint-disable-next-line default-case -- Bevisst deaktivert for å få TS sjekk på at alle dispatch.type verdier er handtert
  switch(dispatch.type) {
    case "OnValgtMalChanged": {
      // Når valgt mal har blitt endra, endre tredjepartsmottakerAktivert og valgtMottakerId i henhold.
      const tredjepartsmottakerAktivert = state.tredjepartsmottakerAktivert && (dispatch.valgtMal?.støtterTredjepartsmottaker || false)
      const valgtMottakerId = dispatch.valgtMal?.mottakere[0]?.id
      return {
        ...state,
        tredjepartsmottakerAktivert,
        valgtMottakerId,
      }
    }
    case "SettValgtMal": {
      const valgtMalkode = dispatch.malkode
      return {
        ...state,
        valgtMalkode,
      }
    }
    // Når fritekstForslag blir satt skal valgtFritekst settast til innhald i første forslag
    case "SettFritekstForslag": {
      const { fritekstForslag } = dispatch
      const valgtFritekst = fritekstForslag[0]
      return {
        ...state,
        fritekstForslag,
        valgtFritekst,
      }
    }
    case "SettValgtFritekst": {
      const { valgtFritekst } = dispatch
      return {
        ...state,
        valgtFritekst
      }
    }
    case "SettValgtMottakerId": {
      const { valgtMottakerId } = dispatch
      return {
        ...state,
        valgtMottakerId,
      }
    }
    case "SettTredjepartsmottakerAktivert": {
      const { tredjepartsmottakerAktivert } = dispatch
      return {
        ...state,
        tredjepartsmottakerAktivert
      }
    }
    case "SettTredjepartsmottaker": {
      const { tredjepartsmottaker } = dispatch
      return {
        ...state,
        tredjepartsmottaker
      }
    }
  }
}

const initMessagesState = (maler: Template[]): MessagesState => ({
  valgtMalkode: maler[0]?.kode,
  fritekstForslag: [],
  valgtFritekst: undefined,
  valgtMottakerId: undefined,
  tredjepartsmottakerAktivert: false,
  tredjepartsmottaker: undefined,
})

const Messages = ({
  maler,
  fagsak,
  behandling,
  personopplysninger,
  arbeidsgiverOpplysningerPerId,
  api,
}: MessagesProps) => {
  const [{
    valgtMalkode,
    fritekstForslag,
    valgtFritekst,
    valgtMottakerId,
    tredjepartsmottakerAktivert,
    tredjepartsmottaker,
  }, dispatch] = useReducer(messagesStateReducer, initMessagesState(maler))
  const fritekstInputRef = useRef<FritekstInputMethods>(null);
  // showValidation is set to true when inputs should display any validation errors, i.e. after the user tries to submit the form without having valid values.
  const [showValidation, setShowValidation] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const setValgtMalkode = (malkode: string | undefined) => dispatch({type: 'SettValgtMal', malkode})
  const setFritekstForslag = (newFritekstForslag: FritekstbrevDokumentdata[]) => dispatch({type: "SettFritekstForslag", fritekstForslag: newFritekstForslag})
  const setValgtFritekst = (newValgtFritekst: FritekstbrevDokumentdata | undefined) => dispatch({type: "SettValgtFritekst", valgtFritekst: newValgtFritekst})
  const setValgtMottakerId = (newValgtMottakerId: string | undefined) => dispatch({type: "SettValgtMottakerId", valgtMottakerId: newValgtMottakerId})
  const setTredjepartsmottakerAktivert = (newTredjepartsmottakerAktivert: boolean) => dispatch({type: "SettTredjepartsmottakerAktivert", tredjepartsmottakerAktivert: newTredjepartsmottakerAktivert})
  const setTredjepartsmottaker = (newTredjepartsmottaker: TredjepartsmottakerValue | TredjepartsmottakerError | undefined) => dispatch({type: "SettTredjepartsmottaker", tredjepartsmottaker: newTredjepartsmottaker})
  const onValgtMalChanged = (newValgtMal: Template | undefined) => dispatch({type: "OnValgtMalChanged", valgtMal: newValgtMal})

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
    onValgtMalChanged(valgtMal)
  }, [valgtMal]);

  const showFritekstInput = (valgtMal?.støtterFritekst || valgtMal?.støtterTittelOgFritekst) ?? false;

  // FritekstbrevinnholdDto must be undefined or have props set with string value
  const resolveFritekstbrevinnholdDto = (
    fritekstInputValue: FritekstInputValue | FritekstInputInvalid | undefined,
  ): FritekstbrevinnholdDto | undefined => {
    if (fritekstInputValue?.tittel !== undefined && fritekstInputValue?.tekst !== undefined) {
      return {
        overskrift: fritekstInputValue.tittel,
        brødtekst: fritekstInputValue.tekst,
      };
    }
    return undefined;
  };

  // overstyrtMottaker skal vere valgt mottaker frå MottakerSelect, viss ikkje tredjepartsmottaker alternativ er valgt der.
  // Viss sending til tredjepartsmottaker er aktivert skal den settast til inntasta orgnr.
  const resolveOvertyrtMottaker = (): MottakerDto | undefined => {
    if (valgtMottakerId !== undefined && !tredjepartsmottakerAktivert) {
      return valgtMal?.mottakere.filter(m => m.id === valgtMottakerId)[0];
    }
    if (tredjepartsmottakerAktivert && tredjepartsmottaker?.organisasjonsnr !== undefined) {
      return {
        id: tredjepartsmottaker.organisasjonsnr,
        type: 'ORGNR',
      };
    }
    return undefined;
  };

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
    const fritekst = fritekstInputValue?.tekst;
    const overstyrtMottaker = resolveOvertyrtMottaker();
    // Viss valg for sending til tredjepartsmottaker er aktivt må overstyrtMottaker vere definert
    if (tredjepartsmottakerAktivert && overstyrtMottaker === undefined) {
      return undefined; // Valideringsfeil
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
        setValgtMalkode(maler[0]?.kode)
        fritekstInputRef.current?.reset();
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
        valgtMottakerId={valgtMottakerId}
        onChange={setValgtMottakerId}
        disabled={tredjepartsmottakerAktivert}
      />
      <Checkbox
        checked={tredjepartsmottakerAktivert}
        onChange={() => setTredjepartsmottakerAktivert(!tredjepartsmottakerAktivert)}
        size="small"
        disabled={!valgtMal?.støtterTredjepartsmottaker}
        >Send til tredjepart</Checkbox>
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
        showTitle={valgtMal?.støtterTittelOgFritekst === true}
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
