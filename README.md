# k9-sak-frontend

Monorepo for Frontend kode for k9-sak.

[![](https://github.com/navikt/k9-sak-web/workflows/Deploy%20Docker%20image/badge.svg)](https://github.com/navikt/k9-sak-web/actions?query=workflow%3A%22Deploy+Docker+image%22)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=navikt_k9-sak-frontend&metric=alert_status)](https://sonarcloud.io/dashboard?id=navikt_k9-sak-frontend)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Mikrofrontends i bruk per behandling

### Pleiepenger sykt barn

[Omsorgen for](https://github.com/navikt/omsorgen-for-frontend)
[Uttak](https://github.com/navikt/psb-uttak-frontend)
[Inntektsmelding](https://github.com/navikt/psb-inntektsmelding-frontend)
[Etablert tilsyn](https://github.com/navikt/psb-etablert-tilsyn-frontend)
[Medisinsk vilkår](https://github.com/navikt/medisinsk-vilkar-frontend)
[Om barnet](https://github.com/navikt/psb-om-barnet-frontend)

### Omsorgsdager (Utvidet rett)

[Omsorgsdager](https://github.com/navikt/omsorgsdager-frontend)

## Komme i gang

k9-sak-web har dependencies til pakker publisert fra [k9-frontend-modules](https://github.com/navikt/k9-frontend-modules).

For å få hentet pakker fra GitHub sitt pakkeregistry må man sette opp lokal NPM med autentisering mot GitHub med en Personal Access Token (PAT) med `read:packages`-tilgang i lokalt utviklingsmiljø, før man gjør `yarn install`. GitHub har en guide på hvordan man gjør dette [her](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages).

TLDR er å opprette en GitHub PAT med kun `read:packages`-tilgang, enable SSO, og putte det i en egen ~/.yarnrc.yml-fil slik:

```
npmRegistries:
  https://npm.pkg.github.com:
    npmAlwaysAuth: true
    npmAuthToken: <token>
```

Merk at dette _ikke_ skal sjekkes inn i versjonskontroll.

Når dette er gjort kan man kjøre dette på rot av repo'et for å kjøre opp lokalt utviklingsmiljø:

```
yarn install
yarn dev
```

## Intellj og stubs

Disse må installeres manuelt, følg denne tråden:

https://intellij-support.jetbrains.com/hc/en-us/community/posts/207725245-React-import-are-not-resolved-in-WebStrom-and-Intellij-2016-2

## Workspaces

- Common dev dependencies skal kun ligge på roten. ref
  https://medium.com/@jsilvax/a-workflow-guide-for-lerna-with-yarn-workspaces-60f97481149d
  > If you have common dev dependencies, it’s better to specify them in the workspace root package.json.
  > For instance, this can be dependencies like Jest, Husky, Storybook, Eslint, Prettier, etc.

## Mocks i dev-serveren

Kan konfigureres via å sette opp en `.env`-fil i roten av prosjektet.

### Feature toggles

Aktiveres ved å definiere en eller flere features i `.env`-fila i roten av prosjektet.

```
UNNTAKSBEHANDLING=true
```

### Overstyr enkeltrute (webpack/mocks/fake-error.js)

Nyttig for å teste feilsituasjoner. Overstyres som følger:

```
FAKE_ERROR_PATH=/k9/sak/api/behandling/person/personopplysninger
FAKE_ERROR_CODE=401
FAKE_ERROR_BODY={"error":"dette fikk galt"}
```

### Licenses and attribution

_For updated information, always see LICENSE first!_

#### Icons

This project uses Streamline Icons. If you use k9-sak-web in your project please adhere to the Streamline Icons license agreement found here: https://streamlineicons.com/ux/extended-license.html

### For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen **#k9sak-frontend-tech**.
