import avslattImage from '@fpsak-frontend/assets/images/avslaatt_hover.svg';
import innvilgetImage from '@fpsak-frontend/assets/images/innvilget_hover.svg';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { FlexColumn, FlexContainer, FlexRow, Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Lovreferanse } from '@k9-sak-web/gui/shared/lovreferanse/Lovreferanse.js';
import { Aksjonspunkt, Vilkarperiode } from '@k9-sak-web/types';
import { KeyHorizontalIcon } from '@navikt/aksel-icons';
import { Button, Detail, Heading, Label } from '@navikt/ds-react';
import { SetStateAction } from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './vilkarresultatMedOverstyringForm.module.css';
import {
  hent847Text,
  opptjeningMidlertidigInaktivKoder,
} from '@fpsak-frontend/prosess-vilkar-opptjening-oms/src/components/VilkarField';

const isOverridden = (aksjonspunktCodes: string[], aksjonspunktCode: string) =>
  aksjonspunktCodes.some(code => code === aksjonspunktCode);
const isHidden = (kanOverstyre: boolean, aksjonspunktCodes: string[], aksjonspunktCode: string) =>
  !isOverridden(aksjonspunktCodes, aksjonspunktCode) && !kanOverstyre;

const vilkårResultatText = (originalErVilkarOk: boolean, periode: Vilkarperiode) => {
  let text = 'Ikke behandlet';
  if (originalErVilkarOk) {
    text = 'Vilkåret er oppfylt';
  }
  if (originalErVilkarOk === false) {
    text = 'Vilkåret er avslått';
  }
  if (Object.values(opptjeningMidlertidigInaktivKoder).includes(periode.merknad.kode)) {
    text = hent847Text(periode.merknad.kode);
  }
  return (
    <Label size="small" as="p">
      {text}
    </Label>
  );
};

interface VilkarresultatMedOverstyringHeaderProps {
  aksjonspunktCodes: string[];
  aksjonspunkter: Aksjonspunkt[];
  erOverstyrt?: boolean;
  kanOverstyreAccess?: {
    isEnabled: boolean;
  };
  lovReferanse?: string;
  overrideReadOnly: boolean;
  overstyringApKode: string;
  panelTittelKode: string;
  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void;
  status: string;
  periode: Vilkarperiode;
}

const VilkarresultatMedOverstyringHeader = ({
  panelTittelKode,
  erOverstyrt,
  overstyringApKode,
  lovReferanse,
  overrideReadOnly,
  kanOverstyreAccess,
  toggleOverstyring,
  aksjonspunkter,
  periode,
}: Partial<VilkarresultatMedOverstyringHeaderProps>) => {
  const aksjonspunktCodes = aksjonspunkter.map(a => a.definisjon.kode);
  const status = periode.vilkarStatus.kode;
  const erOppfylt = vilkarUtfallType.OPPFYLT === status;
  const erVilkarOk = vilkarUtfallType.IKKE_VURDERT !== status ? erOppfylt : undefined;
  const togglePa = () => {
    toggleOverstyring(oldArray => [...oldArray, overstyringApKode]);
  };
  return (
    <>
      <FlexContainer>
        <FlexRow>
          {!erOverstyrt && erVilkarOk !== undefined && (
            <FlexColumn>
              <Image className={styles.status} src={erVilkarOk ? innvilgetImage : avslattImage} />
            </FlexColumn>
          )}
          <FlexColumn>
            <Heading size="small" level="2">
              <FormattedMessage id={panelTittelKode} />
            </Heading>
          </FlexColumn>
          {lovReferanse && (
            <FlexColumn>
              <Detail className={styles.vilkar}>
                <Lovreferanse>{lovReferanse}</Lovreferanse>
              </Detail>
            </FlexColumn>
          )}
        </FlexRow>
        <FlexRow>
          <FlexColumn>
            <VerticalSpacer eightPx />
            {vilkårResultatText(erVilkarOk, periode)}
          </FlexColumn>
          {erVilkarOk !== undefined &&
            !isHidden(kanOverstyreAccess.isEnabled, aksjonspunktCodes, overstyringApKode) && (
              <FlexColumn>
                <VerticalSpacer fourPx />
                <Button
                  variant="tertiary"
                  size="xsmall"
                  onClick={togglePa}
                  icon={<KeyHorizontalIcon className="-rotate-45 text-3xl" />}
                  disabled={erOverstyrt || overrideReadOnly}
                />
              </FlexColumn>
            )}
        </FlexRow>
      </FlexContainer>
      <VerticalSpacer eightPx />
    </>
  );
};

export default VilkarresultatMedOverstyringHeader;
