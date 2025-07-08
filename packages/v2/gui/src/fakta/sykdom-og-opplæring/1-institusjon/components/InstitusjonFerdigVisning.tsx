import { BodyShort, Box, Label, Tag } from '@navikt/ds-react';
import { InstitusjonVurderingDtoResultat } from '@k9-sak-web/backend/k9sak/generated';
import { LabelledContent } from '../../../../shared/labelled-content/LabelledContent.js';
import { VurdertAv } from '../../../../shared/vurdert-av/VurdertAv.js';
import type { InstitusjonVurderingDtoMedPerioder } from '../types/InstitusjonVurderingDtoMedPerioder.js';
import { CogIcon, PersonPencilFillIcon } from '@navikt/aksel-icons';

interface OwnProps {
  vurdering: InstitusjonVurderingDtoMedPerioder;
}

const InstitusjonFerdigVisning = ({ vurdering }: OwnProps) => (
  <>
    <Box className="mt-8">
      <LabelledContent
        label="På hvilken helseinstitusjon eller kompetansesenter foregår opplæringen?"
        size="small"
        hideLabel={true}
        content={
          <InstitusjonsnavnFerdigVisning
            gjeldendeInstitusjon={vurdering.redigertInstitusjonNavn || vurdering.institusjon}
            institusjonFraSøknad={vurdering.institusjon}
          />
        }
      />
    </Box>
    <div className="flex flex-col gap-6 mt-6">
      <LabelledContent
        label="Er opplæringen ved en godkjent helseinstitusjon eller kompetansesenter?"
        size="small"
        content={
          ((vurdering.resultat === InstitusjonVurderingDtoResultat.GODKJENT_AUTOMATISK ||
            vurdering.resultat === InstitusjonVurderingDtoResultat.GODKJENT_MANUELT) && (
            <BodyShort size="small">Ja</BodyShort>
          )) || <BodyShort size="small">Nei</BodyShort>
        }
      />
      {vurdering.begrunnelse && (
        <div>
          <LabelledContent
            label="Gjør en vurdering av om opplæringen gjennomgås ved en godkjent helseinstitusjon eller et offentlig spesialpedagogisk kompetansesenter etter § 9-14, første ledd."
            indentContent
            size="small"
            content={
              <BodyShort size="small" className="whitespace-pre-wrap">
                {vurdering.begrunnelse}
              </BodyShort>
            }
          />
          <VurdertAv ident={vurdering?.vurdertAv} date={vurdering?.vurdertTidspunkt} />
        </div>
      )}
      {vurdering.resultat === InstitusjonVurderingDtoResultat.GODKJENT_AUTOMATISK && (
        <div className="flex gap-2 items-center">
          <CogIcon fontSize="20" />
          <BodyShort size="small">Automatisk vurdering</BodyShort>
        </div>
      )}
    </div>
  </>
);

const InstitusjonsnavnFerdigVisning = ({
  gjeldendeInstitusjon,
  institusjonFraSøknad,
}: {
  gjeldendeInstitusjon: string;
  institusjonFraSøknad: string;
}) => {
  return (
    <div className="flex flex-col gap-3">
      <Label size="small">På hvilken helseinstitusjon eller kompetansesenter foregår opplæringen?</Label>
      <div className="flex gap-2 items-center">
        <BodyShort size="small">Annen: {gjeldendeInstitusjon}</BodyShort>
        {institusjonFraSøknad === gjeldendeInstitusjon ? (
          <Tag size="small" variant="info">
            Fra søknad
          </Tag>
        ) : (
          <PersonPencilFillIcon
            className="ml-1 align-middle text-2xl text-border-warning"
            title="Endret av saksbehandler"
          />
        )}
      </div>
    </div>
  );
};

export default InstitusjonFerdigVisning;
