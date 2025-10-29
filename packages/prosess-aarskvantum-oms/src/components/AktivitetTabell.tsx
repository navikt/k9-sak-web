import hide from '@fpsak-frontend/assets/images/hide.svg';
import show from '@fpsak-frontend/assets/images/show.svg';
import stjerneImg from '@fpsak-frontend/assets/images/stjerne.svg';
import { Image } from '@fpsak-frontend/shared-components/index';
import { utledArbeidsforholdNavn } from '@fpsak-frontend/utils';
import { calcDays, convertHoursToDays, formatereLukketPeriode } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import {
  ArbeidsforholdV2,
  ArbeidsgiverOpplysningerPerId,
  KodeverkMedNavn,
  Utfalltype,
  Uttaksperiode,
  Vilkår,
  VilkårEnum,
} from '@k9-sak-web/types';
import { FraværÅrsakEnum } from '@k9-sak-web/types/src/omsorgspenger/Uttaksperiode';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, HelpText, Label, Table, Tabs } from '@navikt/ds-react';
import classNames from 'classnames';
import { ReactNode, useMemo, useState } from 'react';
import Utfall from './Utfall';
import styles from './aktivitetTabell.module.css';
import NøkkeltallContainer, { Nokkeltalltype } from './nokkeltall/NokkeltallContainer';
import { durationTilTimerMed7ogEnHalvTimesDagsbasis } from './utils';

interface AktivitetTabellProps {
  behandlingUuid: string;
  arbeidsforhold?: ArbeidsforholdV2;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  arbeidsforholdtypeKode: string;
  uttaksperioder: Uttaksperiode[];
  aktivitetsstatuser: KodeverkMedNavn[];
}

export const antallDager = (periode: string): string | number => {
  const [fom, tom] = periode.split('/');
  return calcDays(fom, tom, false);
};

const dagerOgTimer = (duration?: string) => {
  if (duration) {
    const timer = durationTilTimerMed7ogEnHalvTimesDagsbasis(duration);
    return convertHoursToDays(timer);
  }
  return { days: 0, hours: 0 };
};

const formaterFravær = (periode: string, delvisFravær?: string): ReactNode => {
  if (delvisFravær) {
    const { days, hours } = dagerOgTimer(delvisFravær);
    if (days > 0) {
      return `Delvis fravær (${days, timer: hours}d {timer}t)`;
    }
    return `Delvis fravær (${hours}t)`;
  }
  const dager = antallDager(periode);
  return `Fullt fravær ({dager}d)`;
};

const formaterFraværsårsak = (fraværsårsak: string): ReactNode => {
  switch (fraværsårsak) {
    case FraværÅrsakEnum.ORDINÆRT_FRAVÆR:
      return Ordinært fravær;
    case FraværÅrsakEnum.STENGT_SKOLE_ELLER_BARNEHAGE:
      return Stengt skole eller barnehage;
    case FraværÅrsakEnum.SMITTEVERNHENSYN:
      return Smittevernhensyn;
    default:
      return null;
  }
};

const utfallErIngenUtbetaling = (delvisFravær: string) => {
  if (delvisFravær) {
    const { days, hours } = dagerOgTimer(delvisFravær);

    if (days === 0 && hours === 0) {
      return true;
    }
  }
  return false;
};

const arbeidsforholdSist = (_, [vilkår2]: [Vilkår, Utfalltype]): number =>
  vilkår2 === VilkårEnum.ARBEIDSFORHOLD ? -1 : 0;

const AktivitetTabell = ({
  behandlingUuid,
  arbeidsforhold,
  arbeidsgiverOpplysningerPerId,
  arbeidsforholdtypeKode,
  uttaksperioder,
  aktivitetsstatuser,
}: AktivitetTabellProps) => {
  const [valgtPeriodeIndex, velgPeriodeIndex] = useState<number>();
  const [valgteDetaljfaner, velgDetaljfaner] = useState<number[]>();
  const [listeApneNokkeltall, endreListeApneNokkeltall] = useState<Nokkeltalltype[][]>();

  const velgPeriode = (index: number) => {
    if (valgtPeriodeIndex === index) {
      velgPeriodeIndex(null);
    } else {
      velgPeriodeIndex(index);
    }
  };

  const velgDetaljfane = (faneindex: number) =>
    velgDetaljfaner(Object.assign([], valgteDetaljfaner, { [valgtPeriodeIndex]: faneindex }));

  const apneNokkeltall = listeApneNokkeltall?.[valgtPeriodeIndex];

  const viserAlleDetaljer = apneNokkeltall && Object.values(apneNokkeltall).length === 4;

  const endreApneNokkeltall = (nyeApneNokkeltall: Nokkeltalltype[]) =>
    endreListeApneNokkeltall(Object.assign([], listeApneNokkeltall, { [valgtPeriodeIndex]: nyeApneNokkeltall }));

  const visEllerSkjulAlleNokkeltalldetaljer = () =>
    endreApneNokkeltall(
      viserAlleDetaljer
        ? []
        : [
            Nokkeltalltype.DAGER_SOKER_HAR_RETT_PA,
            Nokkeltalltype.DAGER_NAV_KAN_UTBETALE,
            Nokkeltalltype.FORBRUKTE_DAGER,
            Nokkeltalltype.RESTDAGER,
          ],
    );

  const visEllerSkjulNokkeltalldetaljer = (nokkeltalltype: Nokkeltalltype) => {
    if (apneNokkeltall?.includes(nokkeltalltype)) {
      endreApneNokkeltall(apneNokkeltall.filter(type => type !== nokkeltalltype));
    } else {
      endreApneNokkeltall(apneNokkeltall ? apneNokkeltall.concat([nokkeltalltype]) : [nokkeltalltype]);
    }
  };

  const arbeidsforholdType: string =
    aktivitetsstatuser.find(aktivitetsstatus => aktivitetsstatus.kode === arbeidsforholdtypeKode)?.navn ||
    arbeidsforholdtypeKode;

  const beskrivelse = arbeidsforhold
    ? `${arbeidsforholdType}, ${utledArbeidsforholdNavn(arbeidsforhold, arbeidsgiverOpplysningerPerId)}`
    : arbeidsforholdType;

  const skalÅrsakVises =
    uttaksperioder.find(periode => periode.fraværÅrsak !== FraværÅrsakEnum.UDEFINERT) !== undefined;

  const antallKolonner = skalÅrsakVises ? 6 : 5;

  enum Fanenavn {
    VILKAR,
    HJEMMEL,
    NOKKELTALL,
  }

  return (
    <Box.New padding="4" borderWidth="1" borderRadius="medium" className={styles.aktivitetTabell}>
      <div className={styles.header}>
        <Label size="small" as="p">
          {beskrivelse}
        </Label>
      </div>
      <Table>
        <Table.Header>
          <Table.Row shadeOnHover={false}>
            <Table.HeaderCell scope="col">
              Periode
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">
              Utfall
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">
              Fravær
            </Table.HeaderCell>
            {skalÅrsakVises && (
              <Table.HeaderCell scope="col">
                Årsak
              </Table.HeaderCell>
            )}
            <Table.HeaderCell scope="col">
              Utbetalingsgrad
            </Table.HeaderCell>
            <Table.HeaderCell scope="col" />
          </Table.Row>
        </Table.Header>
        {uttaksperioder.map(
          (
            {
              opprinneligBehandlingUuid,
              periode,
              delvisFravær,
              utfall,
              utbetalingsgrad,
              vurderteVilkår,
              hjemler,
              nøkkeltall,
              fraværÅrsak,
            },
            index,
          ) => {
            const erValgt = valgtPeriodeIndex === index;
            const sorterteVilkår = useMemo(
              () => Object.entries(vurderteVilkår.vilkår).sort(arbeidsforholdSist),
              [vurderteVilkår.vilkår],
            );
            const utfallIngenUtbetaling = utfallErIngenUtbetaling(delvisFravær);
            const ar = periode.match(/^\d{4}/)[0];

            const visVilkarHjemlerEllerNokkeltall = faneindex => {
              switch (faneindex) {
                case Fanenavn.HJEMMEL:
                  return (
                    <Table.DataCell colSpan={antallKolonner}>
                      {hjemler.map(hjemmel => (
                        <div key={`${periode}--${hjemmel}`}>
                          <FormattedMessage id={`Uttaksplan.Hjemmel.${hjemmel}`} />
                        </div>
                      ))}
                    </Table.DataCell>
                  );

                case Fanenavn.NOKKELTALL:
                  return (
                    <Table.DataCell colSpan={antallKolonner}>
                      <NøkkeltallContainer
                        totaltAntallDager={nøkkeltall.totaltAntallDager}
                        antallDagerArbeidsgiverDekker={nøkkeltall.antallDagerArbeidsgiverDekker}
                        antallDagerFraværRapportertSomNyoppstartet={
                          nøkkeltall.antallDagerFraværRapportertSomNyoppstartet
                        }
                        antallDagerInfotrygd={nøkkeltall.antallDagerInfotrygd}
                        antallKoronadager={nøkkeltall.antallKoronadager}
                        forbrukteDager={nøkkeltall.antallForbrukteDager}
                        forbruktTid={nøkkeltall.forbruktTid}
                        restTid={nøkkeltall.restTid}
                        smitteverndager={nøkkeltall.smittevernTid}
                        benyttetRammemelding
                        apneNokkeltall={apneNokkeltall}
                        visEllerSkjulNokkeltalldetaljer={visEllerSkjulNokkeltalldetaljer}
                        migrertData={nøkkeltall.migrertData}
                        ar={ar}
                      />
                    </Table.DataCell>
                  );

                default:
                  return (
                    <>
                      <Table.DataCell>
                        {sorterteVilkår.map(([vilkår, vilkårsutfall]) => (
                          <BodyShort size="small" key={`${periode}--${vilkår}`}>
                            <FormattedMessage
                              id={
                                vilkår === VilkårEnum.ARBEIDSFORHOLD
                                  ? `Uttaksplan.Vilkår.${vilkår}_${vilkårsutfall}`
                                  : `Uttaksplan.Vilkår.${vilkår}`
                              }
                            />
                          </BodyShort>
                        ))}
                      </Table.DataCell>
                      <Table.DataCell>
                        {sorterteVilkår.map(([key, vilkårsutfall]) => (
                          <Utfall utfall={vilkårsutfall} key={`${periode}--${key}.${vilkårsutfall}`} />
                        ))}
                      </Table.DataCell>
                      <Table.DataCell colSpan={antallKolonner - 2} />
                    </>
                  );
              }
            };

            const faner = ['Uttaksplan.Vilkår', 'Uttaksplan.Hjemler'];
            if (nøkkeltall) {
              faner.push(nøkkeltall.migrertData ? 'Uttaksplan.Nokkeltall.Migrert' : 'Uttaksplan.Nokkeltall');
            }

            return (
              <Table.Body key={periode}>
                <Table.Row shadeOnHover={false}>
                  <Table.DataCell>
                    <BodyShort
                      size="small"
                      className={classNames({
                        [styles.ikkeGjeldendeBehandling]: behandlingUuid !== opprinneligBehandlingUuid,
                      })}
                    >
                      {behandlingUuid === opprinneligBehandlingUuid && (
                        <Image
                          className={classNames(styles.starImage)}
                          src={stjerneImg}
                          tooltip="Gjeldende behandling"
                        />
                      )}
                      {formatereLukketPeriode(periode)}
                    </BodyShort>
                  </Table.DataCell>
                  <Table.DataCell>
                    <Utfall
                      utfall={utfall}
                      textId={utfallIngenUtbetaling ? 'Uttaksplan.Utfall.IngenUtbetaling' : undefined}
                    />
                  </Table.DataCell>
                  <Table.DataCell>{formaterFravær(periode, delvisFravær)}</Table.DataCell>
                  {skalÅrsakVises && <Table.DataCell>{formaterFraværsårsak(fraværÅrsak)}</Table.DataCell>}
                  <Table.DataCell>{`${utbetalingsgrad}%`}</Table.DataCell>
                  <Table.DataCell>
                    <Button
                      variant="tertiary"
                      className={styles.utvidelsesknapp}
                      onClick={() => velgPeriode(index)}
                      type="button"
                      aria-expanded={erValgt}
                      aria-label={`Utvid rad for perioden ${formatereLukketPeriode(periode)}`}
                      icon={erValgt ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    />
                  </Table.DataCell>
                </Table.Row>
                {erValgt && (
                  <>
                    <Table.Row className={styles.fanerad} shadeOnHover={false}>
                      <Table.DataCell colSpan={antallKolonner}>
                        <div className={styles.fanewrapper}>
                          <Tabs defaultValue={`${valgteDetaljfaner?.[index]}`} size="small">
                            <Tabs.List>
                              {faner.map((id, idx) => (
                                <Tabs.Tab
                                  key={id}
                                  value={id}
                                  label={<FormattedMessage id={id} />}
                                  onClick={() => velgDetaljfane(idx)}
                                />
                              ))}
                            </Tabs.List>
                          </Tabs>
                          {!nøkkeltall && (
                            <>
                              <BodyShort size="small" className={styles.deaktivertFane}>
                                Nøkkeltall denne perioden
                              </BodyShort>
                              <HelpText>
                                Nøkkeltallene for alle periodene er samlet i den siste perioden.
                              </HelpText>
                            </>
                          )}
                          {valgteDetaljfaner?.[valgtPeriodeIndex] === Fanenavn.NOKKELTALL && (
                            <button
                              className={styles.knappForAlleUtregninger}
                              onClick={visEllerSkjulAlleNokkeltalldetaljer}
                              type="button"
                            >
                              <FormattedMessage
                                id={viserAlleDetaljer ? 'Nøkkeltall.SkjulUtregninger' : 'Nøkkeltall.VisUtregninger'}
                              />
                              <Image src={viserAlleDetaljer ? hide : show} />
                            </button>
                          )}
                        </div>
                      </Table.DataCell>
                    </Table.Row>
                    <Table.Row
                      className={classNames(styles.innholdsrad, !valgteDetaljfaner?.[index] && styles.vilkar)}
                      shadeOnHover={false}
                    >
                      {visVilkarHjemlerEllerNokkeltall(valgteDetaljfaner?.[index])}
                    </Table.Row>
                  </>
                )}
              </Table.Body>
            );
          },
        )}
      </Table>
    </Box.New>
  );
};

export default AktivitetTabell;
