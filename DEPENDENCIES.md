# Avhengigheter vi kanskje ikke trenger

Dette dokumentet viser avhengigheter som er lite brukt, overlapper med noe vi allerede har, eller bare brukes av v1-kode. Tallene er antall filer som importerer pakken, målt i november 2026.

Finn ubrukte avhengigheter med `yarn knip --include dependencies`. Søk i hele repoet etter pakkenavnet før du fjerner noe, også i konfigurasjon, CSS og skript. Status for v1-pakkene står i [MIGRATION.md](packages/v2/MIGRATION.md).

---

## Kan fjernes nå

Kjent erstatning og få filer. Hver linje kan bli en egen liten PR.

- [ ] `history` (13 filer: `sak-app` 5, `v2/gui` 4, `ung/sak-app` 4)
    Alle importene er bare typen `Location`. `react-router` 8.5.1 eksporterer en tilsvarende `Location`-type. Bytt importen og fjern pakken fra rot, `sak-app` og `ung/sak-app`.
- [ ] `redux-thunk` (1 fil: `sak-app/src/configureStore.ts`)
    Ingen kode dispatcher funksjoner. Alle `bindActionCreators` binder vanlige redux-form-handlinger (`change`, `clearFields`, `initialize`, `untouch`). Testoppsettet i `utils-test` og `UnntakProsessStegPanelDef.spec.tsx` lager store uten thunk. Fjern `applyMiddleware(thunk)`.
- [ ] `date-fns-tz` (1 fil: `shared-components/src/DateLabel.tsx`)
    v2 har allerede en identisk [DateLabel](packages/v2/gui/src/shared/dateLabel/DateLabel.tsx) som bruker `dayjs` med `utc` og `timezone`. v1-versjonen brukes bare i `OpptjeningFaktaForm.tsx` og `PersonArbeidsforholdTable.tsx`. Bytt til v2-versjonen og slett v1-versjonen med test. Da forsvinner også to av filene som bruker `date-fns`.
- [ ] `@navikt/ds-icons` (14 filer)
    Pakken har peer-avhengighet på React 17 eller 18, og vi bruker 19. `v2/gui`, `prosess-vedtak` og `prosess-aarskvantum-oms` importerer den uten å ha den i `package.json`. Disse ikonene finnes i `@navikt/aksel-icons`:

    | ds-icons | aksel-icons | Brukes i |
    | --- | --- | --- |
    | `Delete` | `TrashIcon` | `prosess-aarskvantum-oms`, `fakta-omsorgen-for`, `v2/gui` (omsorgen-for) |
    | `Close` | `XMarkIcon` | `fakta-medisinsk-vilkår` (4 skjemaer) |
    | `Cancel` | `XMarkOctagonIcon` | `prosess-vedtak`, `v2/gui` (ung-vedtak) |
    | `Collapse` / `Expand` | `ChevronUpIcon` / `ChevronDownIcon` | `fakta-medisinsk-vilkår` (dokumentfiltrene) |
    | `FilterFilled` | `FunnelFillIcon` | `fakta-medisinsk-vilkår` (dokumentfiltrene) |
    | `People` / `PeopleFilled` / `CoApplicantFilled` | `PersonGroupIcon` / `PersonGroupFillIcon` / `PersonPlusFillIcon` | `fakta-etablert-tilsyn` |
    | `LockedFilled` / `UnlockedFilled` | `PadlockLockedFillIcon` / `PadlockUnlockedFillIcon` | `v2/gui` (visittkort) |
    | `AddCircle` | `PlusCircleIcon` | `v2/gui` (behandlingsvelger) |

    Sjekk ikonene visuelt. `Cancel`, `CoApplicantFilled` og `AddCircle` har ingen opplagt motpart.

## Krever litt mer arbeid

- [ ] `date-fns` (12 filer, 6 i v2)
    Alle ft-pakkene fra FP har `dayjs` som peer-avhengighet, så `dayjs` er standarden. Funksjonene vi bruker er `format`, `parse`, `isBefore`, `isAfter`, `isSameDay`, `addDays`, `subDays`, `startOfDay` og `formatISO`. Alle har en direkte motpart i `dayjs`, og `customParseFormat`, `isSameOrBefore` og `isSameOrAfter` er allerede lagt til i `v2/lib/src/dateUtils/initializeDate.ts`.
- [ ] `modal-sett-pa-vent` (v1-pakke med redux-form)
    `behandling-felles/src/components/paVent/BehandlingPaVent.tsx` bruker fortsatt v1-modalen, selv om v2 har [SettPåVentModal](packages/v2/gui/src/shared/settPåVentModal/SettPåVentModal.tsx). Bytter vi, fjerner vi en redux-form-bruker som ikke står i MIGRATION.md.

## Forsvinner med v1-koden

Disse kan ikke fjernes før v1-pakkene er migrert eller slettet.

- [ ] `formik` (20 filer)
    `prosess-vedtak` (12, trenger avklaring), `form` (5 `*Formik`-komponenter som bare `prosess-vedtak` bruker), `fakta-overstyr-beregning` (2, tier 2) og `fakta-direkte-overgang` (1, `BRUK_V2_DIREKTE_OVERGANG` er på i Q, ikke i prod).
- [ ] `redux-form`, `react-redux`, `redux` og `reselect` (42, 42, 12 og 15 filer)
    Infrastrukturen er `form` (`behandlingForm`), `sak-app/src/configureStore.ts`, `behandling-felles` (`ReduxFormStateCleaner`), `prosess-felles` (`ProsessStegSubmitButton`), `utils-test` og `.storybook/preview.tsx`. Brukere med toggle: `fakta-barn-og-overfoeringsdager`, `fakta-feilutbetaling`, `prosess-avregning` og `prosess-unntak`. Ikke migrert: `prosess-tilbakekreving`, `fakta-arbeidsforhold`, `fakta-opptjening-oms`, `fakta-opplysninger-fra-soknaden`, `prosess-vedtak-tilbakekreving`, anke-pakkene, `fakta-verge`, `prosess-aarskvantum-oms`, `prosess-vedtak` og `modal-sett-pa-vent`.
- [ ] `moment` (41 filer i 21 pakker)
    `vis-timeline` har `moment` som peer-avhengighet, så `moment` kan ikke fjernes før `vis-timeline` er borte. De største brukerne er `fakta-opptjening-oms` (5), `utils` (4, validatorene), `prosess-vedtak` (4) og `prosess-tilbakekreving` (3).
- [ ] `vis-timeline` og `vis-data` (1 fil: `tidslinje/src/Timeline.tsx`)
    `tidslinje` brukes av `fakta-opptjening-oms` og `prosess-tilbakekreving` (ikke migrert), `prosess-tilkjent-ytelse` (`BRUK_V2_TILKJENT_YTELSE`, på i Q) og `prosess-vedtak` (pleiepenger-tidslinjen). Saksbehandlerne ville ikke ha Aksel-tidslinjen i tilkjent ytelse, så veien videre må avklares først.
- [ ] `axios` (23 filer)
    De genererte klientene bruker `fetch`, ikke axios. v1 bruker axios gjennom `rest-api` og `rest-api-hooks`, som fortsatt brukes av blant annet `sak-app` (13 filer) og `ung` (8). I v2 er det bare to steder som gjør kall med axios: [DataFetcher.tsx](packages/v2/gui/src/shared/datafetcher/DataFetcher.tsx) (brukes av tre v1-paneler) og [VurderNyoppstartetIndex.tsx](packages/v2/gui/src/fakta/vurder-nyoppstartet/VurderNyoppstartetIndex.tsx). Resten av v2-bruken er feilhåndtering av `AxiosError` fra v1-kall i `app/errorhandling/`.

## Beholdes

Undersøkt, og vi anbefaler å beholde dem.

- `i18n-iso-countries` (2 filer i v2)
    Backend sender landkoder med tre bokstaver (`NOR`, `GBR`). `Intl.DisplayNames` tar bare to bokstaver, og landkoder er bevisst utelatt fra kodeverkoppslaget i v2 (`K9SakKodeverkoppslag.ts`). Vi trenger altså pakken til oversettelsen.
- `yup` og `@hookform/resolvers` (9 og 3 filer, 5 i v2)
    Brukes aktivt i v2 med egne utvidelser i `utils/validation/yupSchemas.ts`, og ingen skill sier at vi skal slutte med det. De fire v1-filene forsvinner med `prosess-vedtak`, `fakta-overstyr-beregning` og `fakta-direkte-overgang`.
- `classnames` (41 filer, 6 i v2)
    `@navikt/endringslogg` er avhengig av den, så den blir i `node_modules` uansett. v2 bruker `classnames/bind` sammen med CSS-moduler. Liten gevinst å bytte.
