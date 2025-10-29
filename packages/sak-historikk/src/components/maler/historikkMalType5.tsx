import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { HistorikkinnslagDel, HistorikkinnslagEndretFelt, Kodeverk } from '@k9-sak-web/types';
import { BodyShort, Label } from '@navikt/ds-react';
import React, { ReactNode } from 'react';
import { FormattedMessage, injectIntl, IntlShape, WrappedComponentProps } from 'react-intl';

import historikkEndretFeltTypeCodes from '../../kodeverk/historikkEndretFeltTypeCodes';
import historikkEndretFeltTypeHeadingCodes from '../../kodeverk/historikkEndretFeltTypeHeadingCodes';
import HistorikkMal from '../HistorikkMalTsType';
import BubbleText from './felles/bubbleText';
import HistorikkDokumentLenke from './felles/HistorikkDokumentLenke';
import {
  findEndretFeltNavn,
  findEndretFeltVerdi,
  findHendelseText,
  findIdForOpplysningCode,
  findResultatText,
} from './felles/historikkUtils';
import Skjermlenke from './felles/Skjermlenke';

function isGjeldendeFraUtenEndredeFelter(historikkinnslagDel: HistorikkinnslagDel): boolean {
  return historikkinnslagDel.gjeldendeFra && !historikkinnslagDel.endredeFelter;
}

const lagGjeldendeFraInnslag = (historikkinnslagDel: HistorikkinnslagDel): ReactNode => {
  if (!historikkinnslagDel.gjeldendeFra) {
    return undefined;
  }
  if (historikkinnslagDel.gjeldendeFra && historikkinnslagDel.gjeldendeFra.navn) {
    return (
      <>
        <FormattedMessage
          id={historikkEndretFeltTypeCodes[historikkinnslagDel.gjeldendeFra.navn].feltId}
          values={{ value: historikkinnslagDel.gjeldendeFra.verdi, b: chunks => <b>{chunks}</b>, br: <br /> }}
        />
        {historikkinnslagDel.gjeldendeFra.fra && (
          <FormattedMessage
            id="Historikk.Template.5.VerdiGjeldendeFra"
            values={{ dato: historikkinnslagDel.gjeldendeFra.fra, b: chunks => <b>{chunks}</b> }}
          />
        )}
        {isGjeldendeFraUtenEndredeFelter(historikkinnslagDel) && (
          <FormattedMessage id="Historikk.Template.5.IngenEndring" />
        )}
      </>
    );
  }
  if (historikkinnslagDel.gjeldendeFra && !historikkinnslagDel.gjeldendeFra.navn) {
    return (
      <>
        <FormattedMessage
          id="Historikk.Template.5.GjeldendeFra"
          values={{ dato: historikkinnslagDel.gjeldendeFra.fra, b: chunks => <b>{chunks}</b> }}
        />
        {isGjeldendeFraUtenEndredeFelter(historikkinnslagDel) && (
          <FormattedMessage id="Historikk.Template.5.IngenEndring" />
        )}
      </>
    );
  }
  return undefined;
};

const lageElementInnhold = (
  historikkDel: HistorikkinnslagDel,
  intl: IntlShape,
  getKodeverknavn: (kodeverk: Kodeverk) => string,
): string[] => {
  const list = [];
  if (historikkDel.hendelse) {
    list.push(findHendelseText(historikkDel.hendelse, getKodeverknavn));
  }
  if (historikkDel.resultat) {
    list.push(findResultatText(historikkDel.resultat, intl, getKodeverknavn));
  }
  return list;
};

const formatChangedField = (
  endretFelt: HistorikkinnslagEndretFelt,
  intl: IntlShape,
  getKodeverknavn: (kodeverk: Kodeverk) => string,
): ReactNode => {
  const fieldName = findEndretFeltNavn(endretFelt, intl);
  const fromValue = findEndretFeltVerdi(endretFelt, endretFelt.fraVerdi, intl, getKodeverknavn);
  const toValue = findEndretFeltVerdi(endretFelt, endretFelt.tilVerdi, intl, getKodeverknavn);

  if (endretFelt.fraVerdi !== null) {
    return (
      <FormattedMessage
        id="Historikk.Template.5.ChangedFromTo"
        values={{
          fieldName,
          fromValue,
          toValue,
          b: chunks => <b>{chunks}</b>,
        }}
      />
    );
  }
  return (
    <FormattedMessage
      id="Historikk.Template.5.FieldSetTo"
      values={{
        fieldName,
        value: toValue,
        b: chunks => <b>{chunks}</b>,
      }}
    />
  );
};

const lagTemaHeadingId = (historikkinnslagDel: HistorikkinnslagDel): ReactNode => {
  const { tema } = historikkinnslagDel;
  if (tema) {
    const heading = historikkEndretFeltTypeHeadingCodes[tema.endretFeltNavn.kode];
    if (heading && tema.navnVerdi) {
      return (
        <BodyShort size="small">
          <FormattedMessage
            id={heading.feltId}
            values={{ value: tema.navnVerdi, b: chunks => <b>{chunks}</b>, br: <br /> }}
          />
        </BodyShort>
      );
    }
  }
  return undefined;
};

const lagSoeknadsperiode = (
  soeknadsperiode: HistorikkinnslagDel['soeknadsperiode'],
  getKodeverknavn: (kodeverk: Kodeverk) => string,
): ReactNode => (
  <>
    <b>{getKodeverknavn(soeknadsperiode.soeknadsperiodeType)}</b>
    {soeknadsperiode.navnVerdi && (
      <>
        <br />
        {` ${soeknadsperiode.navnVerdi}`}
      </>
    )}
    <br />
    {` ${soeknadsperiode?.tilVerdi}`}
  </>
);

const HistorikkMalType5 = ({
  intl,
  historikkinnslag,
  behandlingLocation,
  getKodeverknavn,
  createLocationForSkjermlenke,
  saksnummer,
}: HistorikkMal & WrappedComponentProps) => (
  <>
    {historikkinnslag.historikkinnslagDeler.map((historikkinnslagDel, historikkinnslagDelIndex) => (
      <div
        key={
          `historikkinnslagDel${historikkinnslagDelIndex}` // eslint-disable-line react/no-array-index-key
        }
      >
        {historikkinnslagDel.skjermlenke && (
          <Skjermlenke
            skjermlenke={historikkinnslagDel.skjermlenke}
            behandlingLocation={behandlingLocation}
            getKodeverknavn={getKodeverknavn}
            scrollUpOnClick
            createLocationForSkjermlenke={createLocationForSkjermlenke}
          />
        )}

        {lageElementInnhold(historikkinnslagDel, intl, getKodeverknavn).map(tekst => (
          <div key={tekst}>
            <Label size="small" as="p">
              {tekst}
            </Label>
          </div>
        ))}

        {lagGjeldendeFraInnslag(historikkinnslagDel)}

        {historikkinnslagDel.soeknadsperiode &&
          lagSoeknadsperiode(historikkinnslagDel.soeknadsperiode, getKodeverknavn)}

        {lagTemaHeadingId(historikkinnslagDel)}

        {historikkinnslagDel.endredeFelter &&
          historikkinnslagDel.endredeFelter.map((endretFelt, i) => (
            <BodyShort size="small" key={`endredeFelter${i + 1}`}>
              {formatChangedField(endretFelt, intl, getKodeverknavn)}
            </BodyShort>
          ))}

        {historikkinnslagDel.opplysninger &&
          historikkinnslagDel.opplysninger.map(opplysning => (
            <BodyShort size="small">
              <FormattedMessage
                id={findIdForOpplysningCode(opplysning)}
                values={{ antallBarn: opplysning.tilVerdi, b: chunks => <b>{chunks}</b>, br: <br /> }}
                key={`${getKodeverknavn(opplysning.opplysningType)}@${opplysning.tilVerdi}`}
              />
            </BodyShort>
          ))}

        {historikkinnslagDel.aarsak && (
          <BodyShort size="small">{getKodeverknavn(historikkinnslagDel.aarsak)}</BodyShort>
        )}
        {historikkinnslagDel.begrunnelse && <BubbleText bodyText={getKodeverknavn(historikkinnslagDel.begrunnelse)} />}
        {historikkinnslagDel.begrunnelseFritekst && <BubbleText bodyText={historikkinnslagDel.begrunnelseFritekst} />}
        {historikkinnslag.dokumentLinks &&
          historikkinnslag.dokumentLinks.map(dokumentLenke => (
            <HistorikkDokumentLenke
              key={`${dokumentLenke.tag}@${dokumentLenke.url}`}
              dokumentLenke={dokumentLenke}
              saksnummer={saksnummer}
            />
          ))}

        {historikkinnslagDelIndex < historikkinnslag.historikkinnslagDeler.length - 1 && <VerticalSpacer sixteenPx />}
      </div>
    ))}
  </>
);

export default injectIntl(HistorikkMalType5);
