import { fagsakYtelsesType, type FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { OmsorgenForDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorg/OmsorgenForDto.js';
import { DetailView } from '@k9-sak-web/gui/shared/detailView/DetailView.js';
import { LabelledContent } from '@k9-sak-web/gui/shared/labelled-content/LabelledContent.js';
import { Lovreferanse } from '@k9-sak-web/gui/shared/lovreferanse/Lovreferanse.js';
import { VurdertAv } from '@k9-sak-web/gui/shared/vurdert-av/VurdertAv.js';
import WriteAccessBoundContent from '@k9-sak-web/gui/shared/write-access-bound-content/WriteAccessBoundContent.js';
import { BodyShort, Box, Button, Label, Tag } from '@navikt/ds-react';
import { type JSX } from 'react';
import styles from './omsorgsperiodeVurderingsdetaljer.module.css';
import Relasjon from './types/Relasjon';
import { erAutomatiskVurdert, erIkkeOppfylt, erManueltVurdert, erOppfylt } from './util/utils.js';

interface OmsorgsperiodeVurderingsdetaljerProps {
  omsorgsperiode: OmsorgenForDto;
  onEditClick: () => void;
  registrertForeldrerelasjon: boolean;
  readOnly: boolean;
  sakstype?: FagsakYtelsesType;
}

const OmsorgsperiodeVurderingsdetaljer = ({
  omsorgsperiode,
  onEditClick,
  registrertForeldrerelasjon,
  readOnly,
  sakstype,
}: OmsorgsperiodeVurderingsdetaljerProps): JSX.Element => {
  const erOMP = sakstype === fagsakYtelsesType.OMSORGSPENGER;
  const hjemmel = erOMP ? 'Vurder om søker har omsorg for barn etter' : 'Vurder om søker har omsorgen for barnet etter';
  const paragraf = erOMP ? '§ 9-5' : sakstype === fagsakYtelsesType.OPPLÆRINGSPENGER ? '§ 9-14' : '§ 9-10, første ledd';
  const automatiskVurdert = erAutomatiskVurdert(omsorgsperiode);
  const label = automatiskVurdert ? (
    <Label size="small">Automatisk vurdert</Label>
  ) : (
    <Label size="small">
      {hjemmel} <Lovreferanse>{paragraf}</Lovreferanse>
    </Label>
  );
  const finnBegrunnelse = (): string => {
    if (erManueltVurdert(omsorgsperiode)) {
      return omsorgsperiode.begrunnelse || '';
    }
    if (automatiskVurdert && !erOMP) {
      return registrertForeldrerelasjon
        ? 'Søker er folkeregistrert forelder'
        : 'Søker er ikke folkeregistrert forelder';
    }
    return '';
  };
  const begrunnelse = finnBegrunnelse();
  const begrunnelseRenderer = () => {
    return (
      <>
        <LabelledContent
          label={label}
          content={
            <BodyShort size="small" className="whitespace-pre-wrap">
              {begrunnelse}
            </BodyShort>
          }
          size="small"
          indentContent
        />
        <VurdertAv size="small" ident={omsorgsperiode?.vurdertAv} date={omsorgsperiode?.vurdertTidspunkt} />
      </>
    );
  };

  const resultatRenderer = () => {
    if (erOppfylt(omsorgsperiode)) {
      return <BodyShort size="small">Ja</BodyShort>;
    }
    if (erIkkeOppfylt(omsorgsperiode)) {
      return <BodyShort size="small">Nei</BodyShort>;
    }
    return null;
  };

  const skalViseRelasjonsbeskrivelse =
    omsorgsperiode.relasjon?.toUpperCase() === Relasjon.ANNET.toUpperCase() && omsorgsperiode.relasjonsbeskrivelse;

  const harSøkerOmsorgenLabel = erOMP
    ? 'Er vilkåret oppfylt for denne perioden?'
    : 'Har søker omsorgen for barnet i denne perioden?';

  return (
    <DetailView
      title={erOMP ? 'Vurdering' : 'Vurdering av omsorg'}
      border
      contentAfterTitleRenderer={() => (
        <WriteAccessBoundContent
          contentRenderer={() => (
            <Button variant="tertiary" size="xsmall" className={styles.endreLink} onClick={onEditClick}>
              Rediger vurdering
            </Button>
          )}
          readOnly={readOnly}
        />
      )}
    >
      {erManueltVurdert(omsorgsperiode) && (
        <>
          {omsorgsperiode.relasjon && (
            <Box marginBlock="space-8 space-0">
              <LabelledContent
                size="small"
                label="Hvilken relasjon har søker til barnet?"
                content={
                  <div className="flex gap-2 items-center">
                    <BodyShort size="small" className="whitespace-pre-wrap">
                      {omsorgsperiode.relasjon}
                    </BodyShort>
                    <Tag size="small" variant="info">
                      Fra søknad
                    </Tag>
                  </div>
                }
              />
            </Box>
          )}
          {skalViseRelasjonsbeskrivelse && (
            <Box marginBlock="space-8 space-0">
              <LabelledContent
                size="small"
                label="Beskrivelse fra søker"
                content={
                  <BodyShort size="small" className="whitespace-pre-wrap">
                    {omsorgsperiode.relasjonsbeskrivelse}
                  </BodyShort>
                }
              />
            </Box>
          )}
        </>
      )}
      <Box marginBlock="space-8 space-0">{begrunnelseRenderer()}</Box>
      <Box marginBlock="space-8 space-0">
        <LabelledContent size="small" label={harSøkerOmsorgenLabel} content={resultatRenderer()} />
      </Box>
    </DetailView>
  );
};

export default OmsorgsperiodeVurderingsdetaljer;
