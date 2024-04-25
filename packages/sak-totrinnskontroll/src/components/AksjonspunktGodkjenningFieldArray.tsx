import { CheckboxField, NavFieldGroup, RadioGroupField, TextAreaField } from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ArrowBox, FlexColumn, FlexContainer, FlexRow } from '@fpsak-frontend/shared-components';
import { hasValidText, maxLength, minLength, required } from '@fpsak-frontend/utils';
import { KlageVurdering, Kodeverk, KodeverkMedNavn, TotrinnskontrollSkjermlenkeContext } from '@k9-sak-web/types';
import { BodyShort, Detail, Radio } from '@navikt/ds-react';
import { Location } from 'history';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { FieldArrayFieldsProps } from 'redux-form';

import getAksjonspunkttekst from './aksjonspunktTekster/aksjonspunktTekstUtleder';

import styles from './aksjonspunktGodkjenningFieldArray.module.css';

const minLength3 = minLength(3);
const maxLength2000 = maxLength(2000);

export type AksjonspunktGodkjenningData = {
  aksjonspunktKode: string;
  totrinnskontrollGodkjent?: boolean;
  besluttersBegrunnelse?: string;
  feilFakta?: boolean;
  feilRegel?: boolean;
  feilLov?: boolean;
  annet?: boolean;
};

interface OwnProps {
  fields: FieldArrayFieldsProps<AksjonspunktGodkjenningData>;
  totrinnskontrollSkjermlenkeContext: TotrinnskontrollSkjermlenkeContext[];
  readOnly: boolean;
  showBegrunnelse?: boolean;
  klageKA?: boolean;
  erForeldrepengerFagsak: boolean;
  klagebehandlingVurdering?: KlageVurdering;
  behandlingStatus: Kodeverk;
  arbeidsforholdHandlingTyper: KodeverkMedNavn[];
  erTilbakekreving: boolean;
  skjemalenkeTyper: KodeverkMedNavn[];
  lagLenke: (skjermlenkeCode: string) => Location;
}

export const AksjonspunktGodkjenningFieldArray = ({
  fields,
  totrinnskontrollSkjermlenkeContext,
  readOnly,
  showBegrunnelse = false,
  klageKA = false,
  klagebehandlingVurdering,
  behandlingStatus,
  arbeidsforholdHandlingTyper,
  erTilbakekreving,
  skjemalenkeTyper,
  lagLenke,
}: OwnProps) => (
  <>
    {fields.map((id, index) => {
      const { aksjonspunktKode, totrinnskontrollGodkjent } = fields.get(index);
      const context = totrinnskontrollSkjermlenkeContext.find(c =>
        c.totrinnskontrollAksjonspunkter.some(ta => ta.aksjonspunktKode === aksjonspunktKode),
      );
      const totrinnskontrollAksjonspunkt = context.totrinnskontrollAksjonspunkter.find(
        c => c.aksjonspunktKode === aksjonspunktKode,
      );

      const erKlageKA = klageKA && totrinnskontrollGodkjent;
      const erAnke =
        aksjonspunktKode === aksjonspunktCodes.MANUELL_VURDERING_AV_ANKE && totrinnskontrollGodkjent === true;
      const visKunBegrunnelse = erAnke || erKlageKA ? totrinnskontrollGodkjent : showBegrunnelse;
      const visArsaker = erAnke || erKlageKA || totrinnskontrollGodkjent === false;

      const aksjonspunktText = getAksjonspunkttekst(
        klagebehandlingVurdering,
        behandlingStatus,
        arbeidsforholdHandlingTyper,
        erTilbakekreving,
        totrinnskontrollAksjonspunkt,
      );

      const skjermlenkeTypeKodeverk = skjemalenkeTyper.find(
        skjemalenkeType => skjemalenkeType.kode === context.skjermlenkeType,
      );

      const hentSkjermlenkeTypeKodeverkNavn = () => {
        if (skjermlenkeTypeKodeverk.navn === 'Vedtak') {
          return <FormattedMessage id="ToTrinnsForm.Vedtak.Brev" />;
        }
        return skjermlenkeTypeKodeverk.navn;
      };

      return (
        <React.Fragment key={`${skjermlenkeTypeKodeverk.navn}-${id}`}>
          <NavLink to={lagLenke(context.skjermlenkeType)} onClick={() => window.scroll(0, 0)} className={styles.lenke}>
            {hentSkjermlenkeTypeKodeverkNavn()}
          </NavLink>
          <div className={styles.approvalItemContainer}>
            {aksjonspunktText
              .filter(text => !!text)
              .map((formattedMessage, i) => (
                <div
                  key={aksjonspunktKode.concat('_'.concat(i.toString()))}
                  className={styles.aksjonspunktTextContainer}
                >
                  <BodyShort size="small">{formattedMessage}</BodyShort>
                </div>
              ))}
            <NavFieldGroup>
              <RadioGroupField name={`${id}.totrinnskontrollGodkjent`} bredde="M" readOnly={readOnly}>
                <Radio value>
                  <FormattedMessage id="ApprovalField.Godkjent" />
                </Radio>
                <Radio value={false}>
                  <FormattedMessage id="ApprovalField.Vurder" />
                </Radio>
              </RadioGroupField>
              {visArsaker && (
                <ArrowBox alignOffset={erKlageKA ? 1 : 110}>
                  {!visKunBegrunnelse && (
                    <FlexContainer wrap>
                      <FlexRow>
                        <FlexColumn>
                          <Detail className="blokk-xs">
                            <FormattedMessage id="AksjonspunktGodkjenningArsakPanel.Arsak" />
                          </Detail>
                        </FlexColumn>
                      </FlexRow>
                      <FlexRow>
                        <NavFieldGroup className={styles.fullWidth} errorMessageName={`${id}.missingArsakError`}>
                          <FlexRow>
                            <FlexColumn className={styles.halfColumn}>
                              <CheckboxField
                                name={`${id}.feilFakta`}
                                label={<FormattedMessage id="AksjonspunktGodkjenningArsakPanel.FeilFakta" />}
                                readOnly={readOnly}
                              />
                              <CheckboxField
                                name={`${id}.feilRegel`}
                                label={<FormattedMessage id="AksjonspunktGodkjenningArsakPanel.FeilRegelForstaelse" />}
                                readOnly={readOnly}
                              />
                            </FlexColumn>
                            <FlexColumn className={styles.halfColumn}>
                              <CheckboxField
                                name={`${id}.feilLov`}
                                label={<FormattedMessage id="AksjonspunktGodkjenningArsakPanel.FeilLovanvendelse" />}
                                readOnly={readOnly}
                              />
                              <CheckboxField
                                name={`${id}.annet`}
                                label={<FormattedMessage id="AksjonspunktGodkjenningArsakPanel.Annet" />}
                                readOnly={readOnly}
                              />
                            </FlexColumn>
                          </FlexRow>
                        </NavFieldGroup>
                      </FlexRow>
                    </FlexContainer>
                  )}
                  <TextAreaField
                    name={`${id}.besluttersBegrunnelse`}
                    label={<FormattedMessage id="AksjonspunktGodkjenningArsakPanel.Begrunnelse" />}
                    validate={[required, minLength3, maxLength2000, hasValidText]}
                    readOnly={readOnly}
                    maxLength={2000}
                  />
                </ArrowBox>
              )}
            </NavFieldGroup>
          </div>
        </React.Fragment>
      );
    })}
  </>
);

export default AksjonspunktGodkjenningFieldArray;
