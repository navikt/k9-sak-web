import React, { FunctionComponent, ReactNode } from 'react';
import { InputField } from '@fpsak-frontend/form/index';
import { WrappedFieldArrayProps } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import classnames from 'classnames/bind';
import { required, hasValidInteger } from '@fpsak-frontend/utils';
import LeggTilKnapp from '@fpsak-frontend/shared-components/src/LeggTilKnapp';
import Image from '@fpsak-frontend/shared-components/src/Image';
import blyantIkon from '@fpsak-frontend/assets/images/endre.svg';
import { Flatknapp, Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { FlexRow } from '@fpsak-frontend/shared-components/index';
import Overføring, { Overføringsretning, OverføringsretningEnum, Overføringstype } from '../types/Overføring';
import { typeTilTekstIdMap } from './OverføringsdagerPanel';
import styles from './overføringsrader.less';
import Pil from './Pil';

const classNames = classnames.bind(styles);

interface RedigerOverføringsraderProps {
  type: Overføringstype;
  retning: Overføringsretning;
  readOnly: boolean;
  rediger: VoidFunction;
  bekreft: VoidFunction;
}

const retningTilTekstIdMap = {
  [OverføringsretningEnum.INN]: 'FaktaRammevedtak.Overføring.Fra',
  [OverføringsretningEnum.UT]: 'FaktaRammevedtak.Overføring.Til',
};

const renderHeaders = (antallRader: number, type: Overføringstype, retning: Overføringsretning): ReactNode => {
  if (antallRader === 0) {
    return (
      <Element>
        <FormattedMessage id="FaktaRammevedtak.IngenOverføringer" />
      </Element>
    );
  }

  return (
    <div className={classNames('rad', 'headers')}>
      <div className={styles.col20prosent}>
        <Element>
          <FormattedMessage id={typeTilTekstIdMap[type]} />
        </Element>
      </div>
      <div className={styles.col20prosent} />
      <div className={styles.col20prosent}>
        <Element>
          <FormattedMessage id={retningTilTekstIdMap[retning]} />
        </Element>
      </div>
    </div>
  );
};

const RedigerOverføringsrader: FunctionComponent<WrappedFieldArrayProps<Overføring> & RedigerOverføringsraderProps> = ({
  fields,
  type,
  retning,
  readOnly,
  rediger,
  bekreft,
}) => {
  const leggTilRad = () =>
    fields.push({
      kilde: 'lagtTilAvSaksbehandler',
    });

  if (fields.length === 0) {
    return (
      <FlexRow spaceBetween alignItemsToBaseline>
        <Element>
          <FormattedMessage id="FaktaRammevedtak.IngenOverføringer" />
        </Element>
        <Flatknapp
          mini
          kompakt
          onClick={() => {
            leggTilRad();
            rediger();
          }}
          htmlType="button"
        >
          <Image className={styles.marginRight} src={blyantIkon} />
          <Normaltekst>
            <FormattedMessage id="FaktaRammevedtak.Overføring.Rediger" />
          </Normaltekst>
        </Flatknapp>
      </FlexRow>
    );
  }

  return (
    <div>
      {renderHeaders(fields.length, type, retning)}
      <div className={classNames({ relativePosition: fields.length > 0 })}>
        {fields.map(field => (
          // TODO: Mulig field som key kan gi feil hvis man sletter en rad, siden da vil raden under få samme key plutselig?
          <div key={field} className={styles.rad}>
            <span className={classNames('col20prosent', 'dagerInputContainer', { paddingTop: !readOnly })}>
              <span className={classNames({ dagerInput: readOnly })}>
                <InputField
                  name={`${field}.antallDager`}
                  readOnly={!readOnly}
                  label={null}
                  type="number"
                  validate={[required, hasValidInteger]}
                />
              </span>
              <span>
                <FormattedMessage id="FaktaRammevedtak.Overføringsdager.Dager" />
                <FormattedMessage
                  id={
                    retning === OverføringsretningEnum.INN
                      ? 'FaktaRammevedtak.Overføringsdager.Inn'
                      : 'FaktaRammevedtak.Overføringsdager.Ut'
                  }
                />
              </span>
            </span>
            <span className={styles.col20prosent}>
              <Pil retning={retning} />
            </span>
            <span className={classNames('col20prosent', { paddingTop: !readOnly })}>
              <InputField name={`${field}.mottakerAvsenderFnr`} readOnly={!readOnly} />
            </span>
          </div>
        ))}
        {!readOnly && (
          <Flatknapp mini kompakt onClick={rediger} htmlType="button" className={styles.alignCenterRight}>
            <Image className={styles.marginRight} src={blyantIkon} />
            <Normaltekst>
              <FormattedMessage id="FaktaRammevedtak.Overføring.Rediger" />
            </Normaltekst>
          </Flatknapp>
        )}
      </div>

      {readOnly && (
        <FlexRow spaceBetween className={styles.knappseksjon}>
          <LeggTilKnapp onClick={leggTilRad} tekstId="FaktaRammevedtak.Overføring.LeggTil" />
          <div className={styles.bekreftKnapper}>
            <Hovedknapp onClick={bekreft} mini htmlType="button">
              <FormattedMessage id="FaktaRammevedtak.Overføring.Bekreft" />
            </Hovedknapp>
            <Knapp onClick={() => {}} mini htmlType="button">
              <FormattedMessage id="FaktaRammevedtak.Overføring.Avbryt" />
            </Knapp>
          </div>
        </FlexRow>
      )}
    </div>
  );
};

export default RedigerOverføringsrader;
