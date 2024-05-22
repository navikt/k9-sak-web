import React, { useEffect, useRef, useState } from 'react';
import { Button, HStack, Spacer, VStack } from '@navikt/ds-react';
import type { Template } from '@k9-sak-web/backend/k9formidling/models/Template.js';
import type { FritekstbrevDokumentdata } from '@k9-sak-web/backend/k9formidling/models/FritekstbrevDokumentdata.js';
import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { FilePdfIcon, PaperplaneIcon } from '@navikt/aksel-icons';
import type { BestillBrevDto, MottakerDto, FritekstbrevinnholdDto } from '@k9-sak-web/backend/k9sak/generated';
import type { ForhåndsvisDto } from '@k9-sak-web/backend/k9formidling/models/ForhåndsvisDto.js';
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
import MottakerSelect, { tredjepartsmottakerValg } from './MottakerSelect.js';
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
    eksternReferanse: string | undefined,
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

const Messages = ({
  maler,
  fagsak,
  behandling,
  personopplysninger,
  arbeidsgiverOpplysningerPerId,
  api,
}: MessagesProps) => {
  const [valgtMalkode, setValgtMalkode] = useState<string | undefined>(maler[0]?.kode);
  const [fritekstForslag, setFritekstForslag] = useState<FritekstbrevDokumentdata[]>([]);
  const [valgtFritekst, setValgtFritekst] = useState<FritekstbrevDokumentdata | undefined>(undefined);
  const [valgtMottakerId, setValgtMottakerId] = useState<string | undefined>(undefined);
  const [tredjepartsMottaker, setTredjepartsMottaker] = useState<
    TredjepartsmottakerValue | TredjepartsmottakerError | undefined
  >(undefined);
  const fritekstInputRef = useRef<FritekstInputMethods>(null);
  // showValidation is set to true when inputs should display any validation errors, i.e. after the user tries to submit the form without having valid values.
  const [showValidation, setShowValidation] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

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
        const innhold = await api.hentInnholdBrevmal(fagsak.sakstype.kode, behandling.uuid, valgtMalkode);
        setFritekstForslag(innhold);
        setValgtFritekst(innhold[0]);
      }
    };
    loadFritekstForslag();
  }, [valgtMalkode]);

  const valgtMal = maler.find(mal => mal.kode === valgtMalkode);
  useEffect(() => {
    setValgtMottakerId(valgtMal?.mottakere[0]?.id);
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
    if (valgtMottakerId !== undefined && valgtMottakerId !== tredjepartsmottakerValg) {
      return valgtMal?.mottakere.filter(m => m.id === valgtMottakerId)[0];
    }
    if (valgtMottakerId === tredjepartsmottakerValg && tredjepartsMottaker?.organisasjonsnr !== undefined) {
      return {
        id: tredjepartsMottaker.organisasjonsnr,
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
    if (valgtMottakerId === tredjepartsmottakerValg && overstyrtMottaker === undefined) {
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
      } finally {
        setIsBusy(false);
      }
      setShowValidation(false);
      fritekstInputRef.current?.reset();
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
          ytelsesType: fagsak.sakstype,
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
      />
      <TredjepartsmottakerInput
        show={valgtMottakerId === tredjepartsmottakerValg}
        showValidation={showValidation}
        required
        api={api}
        defaultValue={tredjepartsMottaker?.organisasjonsnr}
        onChange={setTredjepartsMottaker}
      />
      <FritekstInput
        språk={behandling.sprakkode.kodeverk}
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
        <Button size="small" variant="secondary" icon={<FilePdfIcon />} loading={isBusy} onClick={previewHandler}>
          Forhåndsvis
        </Button>
      </HStack>
    </VStack>
  );
};

export default Messages;
