import React, { FunctionComponent, ReactNode } from 'react';
import { InputField } from '@fpsak-frontend/form/index';
import { WrappedFieldArrayProps } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import classnames from 'classnames/bind';
import { required, hasValidInteger, hasValidFodselsnummerFormat } from '@fpsak-frontend/utils';
import LeggTilKnapp from '@fpsak-frontend/shared-components/src/LeggTilKnapp';
import Image from '@fpsak-frontend/shared-components/src/Image';
import blyantIkon from '@fpsak-frontend/assets/images/endre.svg';
import { Flatknapp, Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { FlexRow } from '@fpsak-frontend/shared-components/index';
import Overføring, { Overføringsretning, OverføringsretningEnum, Overføringstype } from '../types/Overføring';
import { typeTilTekstIdMap } from './OverføringsdagerPanel';
import styles from './redigerOverføringsrader.less';
import Pil from './Pil';
import FastBreddeAligner from './FastBreddeAligner';

const classNames = classnames.bind(styles);

interface RedigerOverføringsraderProps {
  type: Overføringstype;
  retning: Overføringsretning;
  redigerer: boolean;
  rediger: VoidFunction;
  bekreft: VoidFunction;
  avbryt: VoidFunction;
  readOnly: boolean;
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
    <div className={styles.headers}>
      <FastBreddeAligner
        kolonner={[
          {
            width: '225px',
            id: 'overføring',
            content: (
              <Element>
                <FormattedMessage id={typeTilTekstIdMap[type]} />
              </Element>
            ),
          },
          {
            width: '150px',
            id: 'fra/til',
            content: (
              <Element>
                <FormattedMessage id={retningTilTekstIdMap[retning]} />
              </Element>
            ),
          },
          {
            width: '150px',
            id: 'kilde',
            content: (
              <Element>
                <FormattedMessage id="FaktaRammevedtak.Overføring.Kilde" />
              </Element>
            ),
          },
        ]}
      />
    </div>
  );
};

const RedigerOverføringsrader: FunctionComponent<WrappedFieldArrayProps<Overføring> & RedigerOverføringsraderProps> = ({
  fields,
  type,
  retning,
  redigerer,
  rediger,
  bekreft,
  avbryt,
  readOnly,
}) => {
  const leggTilRad = () =>
    fields.push({
      kilde: 'lagtTilManuelt',
    });

  if (fields.length === 0) {
    return (
      <FlexRow spaceBetween alignItemsToBaseline>
        <Element>
          <FormattedMessage id="FaktaRammevedtak.IngenOverføringer" />
        </Element>
        {!readOnly && (
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
        )}
      </FlexRow>
    );
  }

  return (
    <div>
      {renderHeaders(fields.length, type, retning)}
      <div className={classNames({ relativePosition: fields.length > 0 })}>
        {fields.map(field => (
          <FastBreddeAligner
            kolonner={[
              {
                width: '150px',
                id: `${field}.dager`,
                content: (
                  <span className={styles.dagerInputContainer}>
                    <span className={classNames({ dagerInput: redigerer })}>
                      <InputField
                        name={`${field}.antallDager`}
                        readOnly={!redigerer}
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
                ),
              },
              {
                width: '75px',
                padding: redigerer ? '1em 0 0 0' : undefined,
                id: `${field}.pil`,
                content: <Pil retning={retning} />,
              },
              {
                width: '150px',
                id: `${field}.fnr`,
                padding: '0 20px 0 0',
                content: (
                  <InputField
                    name={`${field}.mottakerAvsenderFnr`}
                    readOnly={!redigerer}
                    validate={[hasValidFodselsnummerFormat]}
                  />
                ),
              },
              {
                width: '150px',
                id: `${field}.kilde`,
                padding: redigerer ? '1em 0 0 0' : '0',
                content: (
                  <InputField
                    name={`${field}.kilde`}
                    readOnly
                    renderReadOnlyValue={value => <FormattedMessage id={`FaktaRammevedtak.Overføring.${value}`} />}
                  />
                ),
              },
            ]}
            // TODO: Mulig field som key kan gi feil hvis man sletter en rad, siden da vil raden under få samme key plutselig?
            key={field}
          />
        ))}
        {!redigerer && !readOnly && (
          <Flatknapp mini kompakt onClick={rediger} htmlType="button" className={styles.alignCenterRight}>
            <Image className={styles.marginRight} src={blyantIkon} />
            <Normaltekst>
              <FormattedMessage id="FaktaRammevedtak.Overføring.Rediger" />
            </Normaltekst>
          </Flatknapp>
        )}
      </div>

      {redigerer && (
        <FlexRow spaceBetween className={styles.knappseksjon}>
          <LeggTilKnapp onClick={leggTilRad} tekstId="FaktaRammevedtak.Overføring.LeggTil" />
          <div className={styles.bekreftKnapper}>
            <Hovedknapp onClick={bekreft} mini htmlType="button">
              <FormattedMessage id="FaktaRammevedtak.Overføring.Bekreft" />
            </Hovedknapp>
            <Knapp onClick={avbryt} mini htmlType="button">
              <FormattedMessage id="FaktaRammevedtak.Overføring.Avbryt" />
            </Knapp>
          </div>
        </FlexRow>
      )}
    </div>
  );
};

export default RedigerOverføringsrader;
