k9-sak-web/backend
==================

Denne pakke er meint å innehalde kode for kommunikasjon med backend servere. Koden i denne pakken skal ikkje vere avhengig
av react eller ha andre frontendspesifikke avhengigheter. Skal i utgangspunktet ha få/ingen avhengigheter utanom
typescript koden som blir generert ut frå openapi spesifikasjonen til aktuell server.

I første omgang re-eksporterer den alt frå @navikt/k9-sak-typescript-client under _k9-sak/generated/*_, så for å bruke kode
derifrå er det tenkt at ein importerer det frå `@k9-sak-web/backend/k9sak/generated/*`

Tilsvarande for andre backends vi har generert klientkode for (`k9-sak-web/Backend/k9klage/generated/*`, etc)

Inneheld og litt manuelt laga kode for kommunikasjon med k9-formidling, og anna kode som er manuelt koda, men direkte
kobla til backend sine typer. For eksempel blir det i _combined_ katalogen laga typer som er ein kombinasjon av genererte
typer og konstanter frå ulike backends.

Eksempel på bruk: Sjå feks _gui/src/behandling/support/historikk/k9/HistorikkBackendClient_

### Lokal versjon av generert kode

Viss ein feks skal jobbe med ein api definisjon for k9-sak som endå ikkje er på master branch i k9-sak, og dermed ikkje har blitt publisert
i _k9-sak-typescript-client_ pakke endå, kan generere klientpakken lokalt ut frå k9-sak prosjektet, og deretter bruke
yarn link til å koble den inn i lokalt k9-sak-web utviklingsmiljø.

1. Sjekk ut den branch av [k9-sak](https://github.com/navikt/k9-sak) du ønsker å ha ein klient generert ut frå.
2. Køyr intellij run config `web/generate typescript client` for å generere lokal versjon. (`gcloud auth login` må vere køyrt før dette)
3. Bruk _yarn link_ som beskrive under for å linke den inn i k9-sak-web.

```shell
yarn link ~/devel/k9-sak/web/target/ts-client
```

Juster filstien slik at den stemmer med der du har klona din k9-sak kode til.

**NB:** Hugs å fjerne link igjen før du committer, slik at endringa i package.json _"resolutions"_ ikkje blir med ut.

```shell
yarn unlink @navikt/k9-sak-typescript-client
```

**NB2:** Etter _yarn link_ eller _yarn unlink_ må kanskje vite restartast for å få med seg endringa i avhengighet.
