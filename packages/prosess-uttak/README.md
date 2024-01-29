# Frontend for uttak

Dette er en frontend for uttak i saksbehandlingen av pleiepenger ved sykt barn.

## Komme i gang

For å kjøre frontend-appen i utvikling, kjør `yarn` etterfulgt av `yarn dev` på rot av prosjektet.

Utviklingsmiljøet er konfigurert opp med en egen webpack-konfig som hoster `index.html` som ligger på rot.
Denne index-filen er kun ment for utvikling.

### Kjøring av tester

`npm test` på rot av prosjektet

### Bygging av appen

`yarn build` på rot av prosjektet

Denne kommandoen vil se på `version` spesifisert i `package.json`, opprette en ny katalog under `build`
som samsvarer med det versjonsnummeret, og legge de bygde filene der.

### Kjøring av bygg

`yarn start` kjører opp en server som statisk hoster innholdet under `build`

---

## Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub

### For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #sif_pleiepenger.
