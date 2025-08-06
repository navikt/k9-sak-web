import { BehandlingDtoBehandlingResultatType as behandlingResultatTypeK9Klage } from '@k9-sak-web/backend/k9klage/generated/types.js';
import { behandlingType as BehandlingTypeK9Klage } from '@k9-sak-web/backend/k9klage/kodeverk/behandling/BehandlingType.js';
import {
  BehandlingDtoBehandlingResultatType as behandlingResultatTypeK9Sak,
  BehandlingDtoSakstype as fagsakYtelseType,
  type ArbeidsgiverOversiktDto,
} from '@k9-sak-web/backend/k9sak/generated';
import { behandlingType as BehandlingTypeK9SAK } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { Bleed, Button, Detail, Fieldset, HGrid, Modal, VStack } from '@navikt/ds-react';
import { Form, SelectField, TextAreaField } from '@navikt/ft-form-hooks';
import { hasValidText, maxLength, required } from '@navikt/ft-form-validators';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Klagepart } from '../types/Klagepart';
import type { Personopplysninger } from '../types/Personopplysninger';
import Brevmottakere from './Brevmottakere';
import dokumentMalType from './dokumentMalType';
import styles from './henleggBehandlingModal.module.css';

const maxLength1500 = maxLength(1500);

export const erTilbakekrevingType = (type?: string) =>
  BehandlingTypeK9Klage.TILBAKEKREVING === type || BehandlingTypeK9Klage.REVURDERING_TILBAKEKREVING === type;

const showHenleggelseFritekst = (behandlingTypeKode: string, årsakKode?: string): boolean =>
  BehandlingTypeK9Klage.REVURDERING_TILBAKEKREVING === behandlingTypeKode &&
  'HENLAGT_FEILOPPRETTET_MED_BREV' === årsakKode; // hvilken backend kommer denne fra?

type Årsaker =
  | 'HENLAGT_SØKNAD_TRUKKET'
  | 'HENLAGT_FEILOPPRETTET'
  | 'HENLAGT_FEILOPPRETTET_MED_BREV'
  | 'HENLAGT_FEILOPPRETTET_UTEN_BREV'
  | 'HENLAGT_KLAGE_TRUKKET'
  | 'HENLAGT_INNSYN_TRUKKET'
  | 'HENLAGT_SØKNAD_MANGLER'
  | 'MANGLER_BEREGNINGSREGLER';

const årsakerForHenleggelse: Record<Årsaker, string> = {
  HENLAGT_SØKNAD_TRUKKET: 'Søknaden er trukket',
  HENLAGT_FEILOPPRETTET: 'Behandlingen er feilaktig opprettet',
  HENLAGT_FEILOPPRETTET_MED_BREV: 'Feilaktig opprettet - med henleggelsesbrev',
  HENLAGT_FEILOPPRETTET_UTEN_BREV: 'Feilaktig opprettet - uten henleggelsesbrev',
  HENLAGT_KLAGE_TRUKKET: 'Klagen er trukket',
  HENLAGT_INNSYN_TRUKKET: 'Innsynskrav er trukket',
  HENLAGT_SØKNAD_MANGLER: 'Søknad mangler',
  MANGLER_BEREGNINGSREGLER: 'Mangler beregningsregler (1. jan 2019)',
};

const henleggArsakerPerBehandlingType = {
  [BehandlingTypeK9Klage.KLAGE]: [
    behandlingResultatTypeK9Klage.HENLAGT_KLAGE_TRUKKET,
    behandlingResultatTypeK9Sak.HENLAGT_FEILOPPRETTET,
  ],
  // ANKE
  'BT-008': [behandlingResultatTypeK9Sak.HENLAGT_SØKNAD_TRUKKET, behandlingResultatTypeK9Sak.HENLAGT_FEILOPPRETTET],
  [BehandlingTypeK9Klage.TILBAKEKREVING]: [behandlingResultatTypeK9Sak.HENLAGT_FEILOPPRETTET],
  [BehandlingTypeK9Klage.REVURDERING_TILBAKEKREVING]: [
    'HENLAGT_FEILOPPRETTET_MED_BREV', // hvilken backend kommer denne fra?
    'HENLAGT_FEILOPPRETTET_UTEN_BREV', // hvilken backend kommer denne fra?
  ],
  [BehandlingTypeK9SAK.REVURDERING]: [
    behandlingResultatTypeK9Sak.HENLAGT_SØKNAD_TRUKKET,
    behandlingResultatTypeK9Sak.HENLAGT_FEILOPPRETTET,
  ],
  [BehandlingTypeK9SAK.FØRSTEGANGSSØKNAD]: [
    behandlingResultatTypeK9Sak.HENLAGT_SØKNAD_TRUKKET,
    behandlingResultatTypeK9Sak.HENLAGT_FEILOPPRETTET,
  ],
  [BehandlingTypeK9SAK.UNNTAKSBEHANDLING]: [
    behandlingResultatTypeK9Sak.HENLAGT_FEILOPPRETTET,
    behandlingResultatTypeK9Sak.HENLAGT_SØKNAD_TRUKKET,
  ],
};

export const getHenleggArsaker = (
  behandlingResultatTyper: string[],
  behandlingType: string,
  ytelseType: string,
): Årsaker[] => {
  const typerForBehandlingType =
    henleggArsakerPerBehandlingType[behandlingType as keyof typeof henleggArsakerPerBehandlingType] ?? [];
  return typerForBehandlingType
    .filter(
      type =>
        ytelseType !== fagsakYtelseType.ENGANGSTØNAD ||
        (ytelseType === fagsakYtelseType.ENGANGSTØNAD && type !== behandlingResultatTypeK9Sak.MANGLER_BEREGNINGSREGLER),
    )
    .map(type => behandlingResultatTyper.find(brt => brt === type))
    .filter((type): type is Årsaker => type !== undefined);
};

const getShowLink = (årsakKode: string, fritekst: string, type: string): boolean => {
  if (type === BehandlingTypeK9Klage.TILBAKEKREVING) {
    return behandlingResultatTypeK9Sak.HENLAGT_FEILOPPRETTET === årsakKode;
  }
  if (type === BehandlingTypeK9Klage.REVURDERING_TILBAKEKREVING) {
    return 'HENLAGT_FEILOPPRETTET_MED_BREV' === årsakKode && !!fritekst; // hvilken backend kommer denne fra?
  }

  return [
    behandlingResultatTypeK9Sak.HENLAGT_SØKNAD_TRUKKET,
    behandlingResultatTypeK9Klage.HENLAGT_KLAGE_TRUKKET,
    'HENLAGT_INNSYN_TRUKKET', // hvilken backend kommer denne fra?
  ].includes(årsakKode);
};

interface HenleggBehandlingModalProps {
  cancelEvent: () => void;
  previewHenleggBehandling: (erHenleggelse: boolean, data: any) => Promise<void>;
  ytelseType: string;
  behandlingId: number;
  behandlingResultatTyper: string[];
  behandlingType: string;
  brevmottakere?: Klagepart[];
  personopplysninger?: Personopplysninger;
  arbeidsgiverOpplysningerPerId?: ArbeidsgiverOversiktDto['arbeidsgivere'];
  handleSubmit: (formValues: any) => void;
}

export type HenleggBehandlingFormvalues = {
  årsakKode: string;
  begrunnelse: string;
  fritekst: string;
  valgtMottaker: string;
};

/**
 * HenleggBehandlingModal
 *
 * Presentasjonskomponent. Denne modalen vises når saksbehandler valger 'Henlegg behandling og avslutt'.
 * Ved å angi årsak og begrunnelse og trykke på 'Henlegg behandling' blir behandlingen henlagt og avsluttet.
 */
export const HenleggBehandlingModal = ({
  handleSubmit,
  cancelEvent,
  previewHenleggBehandling,
  ytelseType,
  behandlingType,
  behandlingId,
  behandlingResultatTyper,
  personopplysninger,
  arbeidsgiverOpplysningerPerId,
  brevmottakere,
}: HenleggBehandlingModalProps) => {
  const [isFetchingPreview, setIsFetchingPreview] = useState<boolean>(false);

  const previewHenleggBehandlingDoc =
    (
      previewHenleggBehandling: (erHenleggelse: boolean, data: any) => void,
      ytelseType: string,
      fritekst: string,
      behandlingId: number,
      behandlingType?: string,
      valgtMottaker?: Klagepart,
    ) =>
    async (): Promise<void> => {
      setIsFetchingPreview(true);
      const data = erTilbakekrevingType(behandlingType)
        ? {
            ytelseType,
            dokumentMal: 'HENLEG',
            fritekst,
            mottaker: 'Søker',
            behandlingId,
          }
        : {
            dokumentMal: dokumentMalType.HENLEGG_BEHANDLING_DOK,
            dokumentdata: { fritekst: fritekst || ' ' },
            overstyrtMottaker: valgtMottaker?.identifikasjon,
          };
      try {
        await previewHenleggBehandling(true, data);
      } finally {
        setIsFetchingPreview(false);
      }
    };

  const formMethods = useForm<HenleggBehandlingFormvalues>({
    defaultValues: {
      årsakKode: '',
      begrunnelse: '',
      fritekst: '',
      valgtMottaker: '',
    },
  });

  const [årsakKode, fritekst, valgtMottaker] = formMethods.watch(['årsakKode', 'fritekst', 'valgtMottaker']);
  const showLink = getShowLink(årsakKode, fritekst, behandlingType);

  const henleggArsaker = useMemo(
    () => getHenleggArsaker(behandlingResultatTyper, behandlingType, ytelseType),
    [behandlingResultatTyper, behandlingType, ytelseType],
  );

  const valgtMottakerObjekt = brevmottakere?.find(mottaker => mottaker.identifikasjon.id === valgtMottaker);

  return (
    <Modal
      className={styles.modal}
      open
      aria-label="Behandlingen henlegges"
      onClose={cancelEvent}
      header={{
        heading: 'Henlegg behandling',
        closeButton: false,
        size: 'small',
      }}
    >
      <Modal.Body>
        <Form<HenleggBehandlingFormvalues> formMethods={formMethods} onSubmit={handleSubmit}>
          <div>
            <Fieldset legend="Henlegg behandling" hideLegend>
              <VStack gap="space-16">
                <HGrid gap="space-4" columns={{ xs: '5fr 7fr' }}>
                  <div>
                    <SelectField
                      name="årsakKode"
                      label="Velg årsak til henleggelse"
                      validate={[required]}
                      selectValues={henleggArsaker.map(arsak => (
                        <option value={arsak} key={arsak}>
                          {årsakerForHenleggelse[arsak] || arsak}
                        </option>
                      ))}
                    />
                  </div>
                </HGrid>
                {showLink && behandlingType === BehandlingTypeK9Klage.KLAGE && (
                  <HGrid gap="space-4" columns={{ xs: '5fr 7fr' }}>
                    <Brevmottakere
                      brevmottakere={brevmottakere}
                      personopplysninger={personopplysninger}
                      arbeidsgiverOpplysninger={arbeidsgiverOpplysningerPerId}
                    />
                  </HGrid>
                )}
                <HGrid gap="space-4" columns={{ xs: '8fr 4fr' }}>
                  <div>
                    <TextAreaField
                      name="begrunnelse"
                      label="Begrunnelse"
                      validate={[required, maxLength1500, hasValidText]}
                      maxLength={1500}
                    />
                  </div>
                </HGrid>
                {showHenleggelseFritekst(behandlingType, årsakKode) && (
                  <HGrid gap="space-4" columns={{ xs: '8fr 4fr' }}>
                    <TextAreaField
                      name="fritekst"
                      label="Fritekst til brev"
                      validate={[required, hasValidText]}
                      maxLength={2000}
                    />
                  </HGrid>
                )}
                <HGrid gap="space-4" columns={{ xs: '7fr 4fr 1fr' }}>
                  <div>
                    <Button variant="primary" size="small" className={styles.button} type="submit">
                      Henlegg behandling
                    </Button>
                    <Button variant="secondary" type="button" size="small" onClick={cancelEvent}>
                      Avbryt
                    </Button>
                  </div>
                  <div>
                    {showLink && (
                      <div className={styles.forhandsvis}>
                        <Detail>Informer søker</Detail>
                        <Bleed marginInline="3 0" asChild>
                          <Button
                            variant="tertiary"
                            size="small"
                            type="button"
                            onClick={previewHenleggBehandlingDoc(
                              previewHenleggBehandling,
                              ytelseType,
                              fritekst,
                              behandlingId,
                              behandlingType,
                              valgtMottakerObjekt,
                            )}
                            data-testid="previewLink"
                            loading={isFetchingPreview}
                          >
                            Forhåndsvis brev
                          </Button>
                        </Bleed>
                      </div>
                    )}
                  </div>
                </HGrid>
              </VStack>
            </Fieldset>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default HenleggBehandlingModal;
