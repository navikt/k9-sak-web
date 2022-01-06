import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { DateLabel } from '@fpsak-frontend/shared-components';
import classnames from 'classnames/bind';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage, FormattedTime } from 'react-intl';
import styles from './behandlingSelected.less';

const getÅrsak = årsak => {
  switch (årsak.behandlingArsakType.kode) {
    case 'RE-MF':
    case 'RE-MFIP':
      return 'Behandlingspunkt.Årsak.ManglerFødselsdato';
    case 'RE-AVAB':
      return 'Behandlingspunkt.Årsak.AvvikAntallBarn';
    case 'RE-LOV':
    case 'RE-RGLF':
      return 'Behandlingspunkt.Årsak.FeilLovanvendelse';
    case 'RE-FEFAKTA':
      return 'Behandlingspunkt.Årsak.EndredeOpplysninger';
    case 'RE-PRSSL':
    case 'RE-ANNET':
      return 'Behandlingspunkt.Årsak.Annet';
    case 'RE-END-FRA-BRUKER':
      return 'Behandlingspunkt.Årsak.Søknad';
    case 'RE-END-INNTEKTSMELD':
      return 'Behandlingspunkt.Årsak.Inntektsmelding';
    case 'BERØRT-BEHANDLING':
      return 'Behandlingspunkt.Årsak.BerørtBehandling';
    case 'KØET-BEHANDLING':
      return 'Behandlingspunkt.Årsak.KøetBehandling';
    case 'RE-KLAG-U-INNTK':
    case 'RE-KLAG-M-INNTK':
    case 'ETTER_KLAGE':
      return 'Behandlingspunkt.Årsak.Klage';
    case 'RE-MDL':
      return 'Behandlingspunkt.Årsak.OpplysningerMedlemskap';
    case 'RE-OPTJ':
      return 'Behandlingspunkt.Årsak.OpplysningerOpptjening';
    case 'RE-FRDLING':
      return 'Behandlingspunkt.Årsak.OpplysningerFordeling';
    case 'RE-INNTK':
      return 'Behandlingspunkt.Årsak.OpplysningerInntekt';
    case 'RE-DØD':
      return 'Behandlingspunkt.Årsak.OpplysningerDød';
    case 'RE-SRTB':
      return 'Behandlingspunkt.Årsak.OpplysningerRelasjon';
    case 'RE-FRIST':
      return 'Behandlingspunkt.Årsak.OpplysningerSøknadsfrist';
    case 'RE-BER-GRUN':
    case 'RE-ENDR-BER-GRUN':
      return 'Behandlingspunkt.Årsak.OpplysningerBeregning';
    case 'RE-YTELSE':
    case 'RE-TILST-YT-INNVIL':
    case 'RE-TILST-YT-OPPH':
      return 'Behandlingspunkt.Årsak.OpplysningerAnnenYtelse';
    case 'RE-HENDELSE-FØDSEL':
    case 'RE-FØDSEL':
      return 'Behandlingspunkt.Årsak.Fødsel';
    case 'RE-HENDELSE-DØD-F':
      return 'Behandlingspunkt.Årsak.SøkerDød';
    case 'RE-HENDELSE-DØD-B':
      return 'Behandlingspunkt.Årsak.BarnDød';
    case 'RE-HENDELSE-DØDFØD':
      return 'Behandlingspunkt.Årsak.Dødfødsel';
    case 'RE-REGISTEROPPL':
      return 'Behandlingspunkt.Årsak.NyeRegisteropplysninger';
    default:
      return 'Behandlingspunkt.Årsak.Annet';
  }
};

const classNames = classnames.bind(styles);
interface BehandlingSelectedProps {
  opprettetDato: string;
  avsluttetDato?: string;
  behandlingsstatus: string;
  behandlingsresultatTypeKode?: string;
  behandlingsresultatTypeNavn?: string;
  behandlingÅrsak?: string;
  behandlingTypeKode?: string;
  førsteÅrsak?: any;
}

const BehandlingSelected: React.FC<BehandlingSelectedProps> = props => {
  const {
    behandlingsstatus,
    opprettetDato,
    avsluttetDato,
    behandlingsresultatTypeKode,
    behandlingsresultatTypeNavn,
    behandlingÅrsak,
    behandlingTypeKode,
    førsteÅrsak,
  } = props;

  const containerCls = classNames('behandlingSelectedContainer', {
    aapen: !behandlingsresultatTypeKode || behandlingsresultatTypeKode === behandlingResultatType.IKKE_FASTSATT,
    avslaatt: behandlingsresultatTypeKode === behandlingResultatType.AVSLATT,
    innvilget: behandlingsresultatTypeKode === behandlingResultatType.INNVILGET,
  });

  const opprettet = () => (
    <div className={styles.opprettet}>
      <div className={styles.opprettetIcon}>
        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            // eslint-disable-next-line max-len
            d="M11.0833 0L12.0294 2.83703C12.1624 2.88753 12.2934 2.9419 12.4224 3L15.0979 1.6629L17.3371 3.90207L16 6.57755C16.0581 6.70657 16.1125 6.83764 16.163 6.9706L19 7.91667V11.0833L16.1627 12.0302C16.1122 12.1632 16.0578 12.2942 15.9996 12.4232L17.3371 15.0979L15.0979 17.3371L12.4232 15.9996C12.2942 16.0578 12.1632 16.1122 12.0302 16.1627L11.0833 19H7.91667L6.9706 16.163C6.83764 16.1125 6.70657 16.0581 6.57755 16L3.90207 17.3371L1.6629 15.0979L3 12.4224C2.9419 12.2934 2.88753 12.1624 2.83703 12.0294L0 11.0833V7.91667L2.83672 6.9714C2.88731 6.83816 2.94179 6.70683 3 6.57755L1.6629 3.90207L3.90207 1.6629L6.57755 3C6.70683 2.94179 6.83816 2.88731 6.9714 2.83672L7.91667 0H11.0833ZM9.5 6.33333C11.2489 6.33333 12.6667 7.7511 12.6667 9.5C12.6667 11.2489 11.2489 12.6667 9.5 12.6667C7.7511 12.6667 6.33333 11.2489 6.33333 9.5C6.33333 7.7511 7.7511 6.33333 9.5 6.33333Z"
            fill="#4F4F4F"
          />
        </svg>
      </div>
      <Undertittel className={styles.opprettetTittel}>Behandling opprettet</Undertittel>
      <div className={styles.opprettetDetails}>
        <Normaltekst>
          <DateLabel dateString={opprettetDato} />
          {` `}
          <FormattedTime value={new Date(opprettetDato)} hour="numeric" minute="numeric" />
          {behandlingTypeKode === behandlingType.REVURDERING && (
            <>
              {` | `} <FormattedMessage id={getÅrsak(førsteÅrsak)} />
            </>
          )}
        </Normaltekst>
      </div>
      <Normaltekst className={styles.opprettetÅrsak}>{`Årsak: ${behandlingÅrsak}`}</Normaltekst>
    </div>
  );

  return (
    <div className={containerCls}>
      <Undertittel>{`${behandlingsstatus} behandling`}</Undertittel>
      <div className={styles.dateContainer}>
        <Normaltekst>
          <DateLabel dateString={opprettetDato} />
          {` - `}
          <DateLabel dateString={avsluttetDato} />
        </Normaltekst>
      </div>
      <div className={styles.resultContainer}>
        <Normaltekst>
          <FormattedMessage id="BehandlingPickerItemContent.Resultat" />
          {`: ${behandlingsresultatTypeKode ? behandlingsresultatTypeNavn : '-'}`}
        </Normaltekst>
      </div>
      <div className={styles.timeline}>{opprettet()}</div>
    </div>
  );
};

export default BehandlingSelected;
