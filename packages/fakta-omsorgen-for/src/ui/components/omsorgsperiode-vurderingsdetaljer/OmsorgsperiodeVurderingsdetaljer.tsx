import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { DetailView } from '@k9-sak-web/gui/shared/detailView/DetailView.js';
import { LabelledContent } from '@k9-sak-web/gui/shared/labelled-content/LabelledContent.js';
import { Lovreferanse } from '@k9-sak-web/gui/shared/lovreferanse/Lovreferanse.js';
import { VurdertAv } from '@k9-sak-web/gui/shared/vurdert-av/VurdertAv.js';
import WriteAccessBoundContent from '@k9-sak-web/gui/shared/write-access-bound-content/WriteAccessBoundContent.js';
import { BodyShort, Box, Button, Label, Tag } from '@navikt/ds-react';
import { type JSX } from 'react';
import { useIntl } from 'react-intl';
import Omsorgsperiode from '../../../types/Omsorgsperiode';
import Relasjon from '../../../types/Relasjon';
import { useOmsorgenForContext } from '../../context/ContainerContext';
import styles from './omsorgsperiodeVurderingsdetaljer.module.css';
import { CogIcon } from '@navikt/aksel-icons';

interface OmsorgsperiodeVurderingsdetaljerProps {
  omsorgsperiode: Omsorgsperiode;
  onEditClick: () => void;
  registrertForeldrerelasjon: boolean;
}

const OmsorgsperiodeVurderingsdetaljer = ({
  omsorgsperiode,
  onEditClick,
  registrertForeldrerelasjon,
}: OmsorgsperiodeVurderingsdetaljerProps): JSX.Element => {
  const intl = useIntl();
  const { sakstype, readOnly } = useOmsorgenForContext();
  const erOMP = sakstype === fagsakYtelsesType.OMSORGSPENGER;
  const begrunnelseRenderer = () => {
    let label = (
      <Label size="small">
        {intl.formatMessage({ id: 'vurdering.hjemmel' })}{' '}
        <Lovreferanse>{intl.formatMessage({ id: 'vurdering.paragraf' })}</Lovreferanse>
      </Label>
    );
    let begrunnelse = '';
    if (omsorgsperiode.erManueltVurdert()) {
      begrunnelse = omsorgsperiode.begrunnelse || '';
    } else if (omsorgsperiode.erAutomatiskVurdert()) {
      if (!erOMP) {
        begrunnelse = registrertForeldrerelasjon
          ? 'Søker er folkeregistrert forelder'
          : 'Søker er ikke folkeregistrert forelder';
      }
      label = (
        <div className="flex items-center gap-2">
          <Label size="small">Automatisk vurdert</Label>
          <CogIcon />
        </div>
      );
    }
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
    if (omsorgsperiode.erOppfylt()) {
      return <BodyShort size="small">Ja</BodyShort>;
    }
    if (omsorgsperiode.erIkkeOppfylt()) {
      return <BodyShort size="small">Nei</BodyShort>;
    }
    return null;
  };

  const skalViseRelasjonsbeskrivelse =
    omsorgsperiode.relasjon?.toUpperCase() === Relasjon.ANNET.toUpperCase() && omsorgsperiode.relasjonsbeskrivelse;

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
      {omsorgsperiode.erManueltVurdert() && (
        <>
          {omsorgsperiode.relasjon && (
            <Box.New marginBlock="8 0">
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
            </Box.New>
          )}
          {skalViseRelasjonsbeskrivelse && (
            <Box.New marginBlock="8 0">
              <LabelledContent
                size="small"
                label="Beskrivelse fra søker"
                content={
                  <BodyShort size="small" className="whitespace-pre-wrap">
                    {omsorgsperiode.relasjonsbeskrivelse}
                  </BodyShort>
                }
              />
            </Box.New>
          )}
        </>
      )}
      <Box.New marginBlock="8 0">{begrunnelseRenderer()}</Box.New>
      <Box.New marginBlock="8 0">
        <LabelledContent
          size="small"
          label={intl.formatMessage({ id: 'vurdering.harOmsorgenFor' })}
          content={resultatRenderer()}
        />
      </Box.New>
    </DetailView>
  );
};

export default OmsorgsperiodeVurderingsdetaljer;
