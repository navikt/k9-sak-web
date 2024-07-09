# k9-sak-frontend

Monorepo for Frontend kode for k9-sak.

[![](https://github.com/navikt/k9-sak-web/workflows/Deploy%20Docker%20image/badge.svg)](https://github.com/navikt/k9-sak-web/actions?query=workflow%3A%22Deploy+Docker+image%22)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Komme i gang

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

Storybook brukes også til utvikling, startes med `yarn storybook`. Se ellers _package.json_ for mer info.

## Workspaces

- Common dev dependencies skal kun ligge på roten. ref
  https://medium.com/@jsilvax/a-workflow-guide-for-lerna-with-yarn-workspaces-60f97481149d
  > If you have common dev dependencies, it’s better to specify them in the workspace root package.json.
  > For instance, this can be dependencies like Jest, Husky, Storybook, Eslint, Prettier, etc.

### Feature toggles

Aktiveres ved å definere en eller flere features i `.env.development`fil i _envDir_ katalogen

## Pakkeoppdatering

### Avhengigheter som må ha samme versjon
Noen sub-pakker i dette prosjekt har avhengigheter til kode fra [ft-frontend-saksbehandling](https://github.com/navikt/ft-frontend-saksbehandling).

Samtidig har disse sub-pakkene felles avhengigheter med koden i [ft-frontend-saksbehandling](https://github.com/navikt/ft-frontend-saksbehandling).
Dette gjør at oppdatering av disse avhengighetene må gjøres synkronisert, slik at vi unngår dupliserte avhengigheter. Viss versjonsnr ikke er
nøyaktig likt vil yarn laste ned flere kopier og installere node_modules med disse nede i avhengighetstreet. Det kan føre til kompileringsfeil,
eller kjøretidsfeil viss avhengighet som blir duplisert inneholder css.

Så ved oppdatering av følgende avhengigheter må man samtidig sørge for at alle pakker som starter på **@navikt/ft-** blir oppdatert
til en versjon som har samme versjon av disse avhengighetene.

- @navikt/aksel-icons
- @navikt/ds-css
- @navikt/ds-react
- @navikt/ds-tailwind
- @navikt/ft-plattform-komponenter
- react-hook-form
- react-router-dom

Eventuelt må man overstyre versjonene med resolutions i package.json slik at de blir like på tvers av avhengighetene.

## Modernisering med packages/v2

For å prøve å skape en mer robust kodebase har vi starta å flytte/skrive om en del eldre kode i _packages/v2_ katalogen.

Kode som legges inn her blir kontrollert av en strengere tsconfig.json. Gammel kode kan importere fra packages/v2, men
det motsatte skal ikke skje, kode under _packages/v2_ skal aldri importere kode som ikke ligger under _v2_. På denne
måten får vi gjort en gradvis overgang til bedre kontrollert typescript.

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen **#sif-teknisk**.
