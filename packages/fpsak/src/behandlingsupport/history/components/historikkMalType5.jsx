import React from 'react';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage, injectIntl, intlShape } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { VerticalSpacer, ElementWrapper } from '@fpsak-frontend/shared-components';
import historikkEndretFeltTypeCodes from '@fpsak-frontend/kodeverk/src/historikkEndretFeltTypeCodes';
import historikkEndretFeltTypeHeadingCodes from '@fpsak-frontend/kodeverk/src/historikkEndretFeltTypeHeadingCodes';

import { historikkinnslagDelPropType } from '@fpsak-frontend/prop-types';
import { injectKodeverk } from '@fpsak-frontend/fp-felles';

import { getAlleKodeverk } from 'kodeverk/duck';
import { createLocationForHistorikkItems } from 'kodeverk/skjermlenkeCodes';
import {
  findEndretFeltNavn,
  findEndretFeltVerdi,
  findHendelseText,
  findIdForOpplysningCode,
  findIdForSoeknadsperiodeCode,
  findResultatText,
} from './historikkUtils';
import HistorikkDokumentLenke from './HistorikkDokumentLenke';

import BubbleText from './bubbleText';

const scrollUp = () => {
  if (window.innerWidth < 1305) {
    window.scroll(0, 0);
  }
  return false;
};

function isGjeldendeFraUtenEndredeFelter(historikkinnslagDel) {
  return (historikkinnslagDel.gjeldendeFra && !historikkinnslagDel.endredeFelter);
}

const lagGjeldendeFraInnslag = (historikkinnslagDel) => {
  if (!historikkinnslagDel.gjeldendeFra) {
    return undefined;
  }
  if (historikkinnslagDel.gjeldendeFra && historikkinnslagDel.gjeldendeFra.navn) {
    return (
      <ElementWrapper>
        <FormattedHTMLMessage
          id={historikkEndretFeltTypeCodes[historikkinnslagDel.gjeldendeFra.navn].feltId}
          values={{ value: historikkinnslagDel.gjeldendeFra.verdi }}
        />
        {historikkinnslagDel.gjeldendeFra.fra
        && (
          <FormattedHTMLMessage
            id="Historikk.Template.5.VerdiGjeldendeFra"
            values={{ dato: historikkinnslagDel.gjeldendeFra.fra }}
          />
        )
        }
        {isGjeldendeFraUtenEndredeFelter(historikkinnslagDel)
        && (
          <div>
            <FormattedHTMLMessage
              id="Historikk.Template.5.IngenEndring"
            />
          </div>
        )
        }
      </ElementWrapper>
    );
  }
  if (historikkinnslagDel.gjeldendeFra && !historikkinnslagDel.gjeldendeFra.navn) {
    return (
      <ElementWrapper>
        <FormattedHTMLMessage
          id="Historikk.Template.5.GjeldendeFra"
          values={{ dato: historikkinnslagDel.gjeldendeFra.fra }}
        />
        {isGjeldendeFraUtenEndredeFelter(historikkinnslagDel)
        && (
          <div>
            <FormattedHTMLMessage
              id="Historikk.Template.5.IngenEndring"
            />
          </div>
        )
        }
      </ElementWrapper>
    );
  }
  return undefined;
};


const HistorikkMalType5 = ({
  historikkinnslagDeler, behandlingLocation, dokumentLinks, intl, saksNr, getKodeverknavn,
}) => {
  const lageElementInnhold = (historikkDel) => {
    const list = [];
    if (historikkDel.hendelse) {
      list.push(findHendelseText(historikkDel.hendelse, getKodeverknavn));
    }
    if (historikkDel.resultat) {
      list.push(findResultatText(historikkDel.resultat, intl));
    }
    return list;
  };

  const formatChangedField = (endretFelt) => {
    const fieldName = findEndretFeltNavn(endretFelt, intl);
    const fromValue = findEndretFeltVerdi(endretFelt, endretFelt.fraVerdi, intl);
    const toValue = findEndretFeltVerdi(endretFelt, endretFelt.tilVerdi, intl);

    if (endretFelt.fraVerdi !== null && endretFelt.endretFeltNavn.kode !== historikkEndretFeltTypeCodes.FORDELING_FOR_NY_ANDEL.kode) {
      return (
        <div>
          <FormattedHTMLMessage
            id="Historikk.Template.5.ChangedFromTo"
            values={{
              fieldName,
              fromValue,
              toValue,
            }}
          />
        </div>
      );
    }
    return (
      <div>
        <FormattedHTMLMessage
          id="Historikk.Template.5.FieldSetTo"
          values={{
            fieldName,
            value: toValue,
          }}
        />
      </div>
    );
  };

  const lagTemaHeadingId = (historikkinnslagDel) => {
    const { tema } = historikkinnslagDel;
    if (tema) {
      const heading = historikkEndretFeltTypeHeadingCodes[tema.endretFeltNavn.kode];
      if (heading && tema.navnVerdi) {
        return <FormattedHTMLMessage id={heading.feltId} values={{ value: tema.navnVerdi }} />;
      }
    }
    return undefined;
  };

  const lagSoeknadsperiode = soeknadsperiode => (soeknadsperiode.navnVerdi
    ? (
      <FormattedHTMLMessage
        id={findIdForSoeknadsperiodeCode(soeknadsperiode)}
        values={{
          navnVerdi: soeknadsperiode.navnVerdi,
          value: soeknadsperiode.tilVerdi,
        }}
      />
    )
    : (
      <FormattedHTMLMessage
        id={findIdForSoeknadsperiodeCode(soeknadsperiode)}
        values={{ value: soeknadsperiode.tilVerdi }}
      />
    ));

  return (
    historikkinnslagDeler.map((historikkinnslagDel, historikkinnslagDelIndex) => (
      <div key={`historikkinnslagDel${historikkinnslagDelIndex}` // eslint-disable-line react/no-array-index-key
      }
      >
        {historikkinnslagDel.skjermlenke
        && (
          <Element>
            <NavLink
              to={createLocationForHistorikkItems(behandlingLocation, historikkinnslagDel.skjermlenke.kode)}
              onClick={scrollUp}
            >
              {getKodeverknavn(historikkinnslagDel.skjermlenke)}
            </NavLink>
          </Element>
        )
        }

        {lageElementInnhold(historikkinnslagDel)
          .map(tekst => (
            <div key={tekst}><Element>{tekst}</Element></div>
          ))}


        {lagGjeldendeFraInnslag(historikkinnslagDel)}


        {historikkinnslagDel.soeknadsperiode && lagSoeknadsperiode(historikkinnslagDel.soeknadsperiode, getKodeverknavn)}

        {lagTemaHeadingId(historikkinnslagDel)}


        {historikkinnslagDel.endredeFelter && historikkinnslagDel.endredeFelter.map((endretFelt, i) => (
          <div key={`endredeFelter${i + 1}`}>
            {formatChangedField(endretFelt)}
          </div>
        ))}

        {historikkinnslagDel.opplysninger && historikkinnslagDel.opplysninger.map(opplysning => (
          <FormattedHTMLMessage
            id={findIdForOpplysningCode(opplysning)}
            values={{ antallBarn: opplysning.tilVerdi }}
            key={`${getKodeverknavn(opplysning)}@${opplysning.tilVerdi}`}
          />
        ))}

        {historikkinnslagDel.aarsak && <Normaltekst>{getKodeverknavn(historikkinnslagDel.aarsak)}</Normaltekst>}
        {historikkinnslagDel.begrunnelse && <BubbleText bodyText={getKodeverknavn(historikkinnslagDel.begrunnelse)} className="snakkeboble-panel__tekst" />}
        {historikkinnslagDel.begrunnelseFritekst && <BubbleText bodyText={historikkinnslagDel.begrunnelseFritekst} className="snakkeboble-panel__tekst" />}
        <div>
          {dokumentLinks && dokumentLinks.map(dokumentLenke => (
            <HistorikkDokumentLenke
              key={`${dokumentLenke.tag}@${dokumentLenke.url}`}
              dokumentLenke={dokumentLenke}
              saksNr={saksNr}
            />
          ))}
        </div>

        {historikkinnslagDelIndex < historikkinnslagDeler.length - 1
        && <VerticalSpacer sixteenPx />
        }
      </div>
    )));
};

HistorikkMalType5.propTypes = {
  historikkinnslagDeler: PropTypes.arrayOf(historikkinnslagDelPropType).isRequired,
  behandlingLocation: PropTypes.shape().isRequired,
  dokumentLinks: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  intl: intlShape.isRequired,
  saksNr: PropTypes.number.isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
};

export default injectIntl(injectKodeverk(getAlleKodeverk)(HistorikkMalType5));
