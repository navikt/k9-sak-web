import { RadioGroupField } from '@fpsak-frontend/form';
import { ArrowBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';
import { BodyShort, Detail, HGrid } from '@navikt/ds-react';
import styles from './aktsomhetReduksjonAvBelopFormPanel.module.css';

interface OwnProps {
  readOnly: boolean;
  erValgtResultatTypeForstoBurdeForstaatt?: boolean;
}

const AktsomhetGradForsettFormPanel = ({ readOnly, erValgtResultatTypeForstoBurdeForstaatt }: OwnProps) => (
  <div>
    <ArrowBox alignOffset={erValgtResultatTypeForstoBurdeForstaatt ? 328 : 368}>
      {erValgtResultatTypeForstoBurdeForstaatt && (
        <HGrid gap="space-4" columns={{ xs: '6fr 6fr' }}>
          <div>
            <Detail>
              Andel som skal tilbakekreves
            </Detail>
            <BodyShort size="small" className={styles.labelPadding}>
              100 %
            </BodyShort>
          </div>
          <div>
            <RadioGroupField
              label={Skal det tillegges renter?}
              validate={[required]}
              name="skalDetTilleggesRenter"
              readOnly={readOnly}
              radios={[
                {
                  value: true,
                  label: Ja,
                },
                {
                  value: false,
                  label: Nei,
                },
              ]}
            />
          </div>
        </HGrid>
      )}
      {!erValgtResultatTypeForstoBurdeForstaatt && (
        <>
          <Detail>
            Andel som skal tilbakekreves
          </Detail>
          <BodyShort size="small">100 %</BodyShort>
          <VerticalSpacer eightPx />
          <BodyShort size="small">
            Det legges til 10 % renter
          </BodyShort>
        </>
      )}
    </ArrowBox>
  </div>
);

export default AktsomhetGradForsettFormPanel;
