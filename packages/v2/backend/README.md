k9-sak-web/backend
==================

Denne pakke er meint å innehalde kode for kommunikasjon med backend servere. Koden i denne pakken skal ikkje vere avhengig
av react eller ha andre frontendspesifikke avhengigheter. Skal i utgangspunktet ha få/ingen avhengigheter utanom
typescript koden som blir generert ut frå openapi spesifikasjonen til aktuell server.

I første omgang re-eksporterer den alt frå @navikt/k9-sak-typescript-client under _k9-sak/generated_, så for å bruke kode
derifrå er det tenkt at ein importerer det frå `@k9-sak-web/backend/k9sak/generated`

Inneheld og generert typescript klient frå k9-klage, litt manuelt laga kode for kommunikasjon med k9-formidling, og litt
anna kode som er manuelt koda, men direkte kobla til backend sine typer. For eksempel blir det i _combined_ katalogen
laga typer som er ein kombinasjon av k9-sak og k9-klage, for nokre stader i gui kode trengs det.

Eksempel på bruk:
```typescript
import { ApiError, K9SakClient, OrganisasjonsEnhet } from '@k9-sak-web/backend/k9sak/generated';
```

### Lokal k9-sak-typescript-client

Viss ein skal jobbe med ein api definisjon som endå ikkje er på master branch i k9-sak, og dermed ikkje har blitt publisert
i _k9-sak-typescript-client_ pakke endå, kan generere klientpakken lokalt ut frå k9-sak prosjektet, og deretter bruke
yarn link til å koble den inn i lokalt k9-sak-web utviklingsmiljø.

1. Sjekk ut den branch av [k9-sak](https://github.com/navikt/k9-sak) du ønsker å ha ein klient generert ut frå.
2. Køyr intellij run config `web/generate typescript client` eller script `dev/generate-openapi-ts-client.sh` for å generere lokal versjon
3. Bruk _yarn link_ som beskrive under for å linke den inn i k9-sak-web.

```shell
yarn link ~/devel/k9-sak/web/target/ts-client
```

Juster filstien slik at den stemmer med der du har klona k9-sak til.

**NB:** Hugs å fjerne link igjen før du committer, slik at endringa i package.json _"resolutions"_ ikkje blir med ut.

```shell
yarn unlink @navikt/k9-sak-typescript-client
```

**NB2:** Etter _yarn link_ eller _yarn unlink_ må kanskje vite restartast for å få med seg endringa i avhengighet.
