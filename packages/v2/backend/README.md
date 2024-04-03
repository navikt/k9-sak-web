k9-sak-web/backend
==================

Denne pakke er meint å innehalde kode for kommunikasjon med backend servere. Koden i denne pakken skal ikkje vere avhengig
av react eller ha andre frontendspesifikke avhengigheter. Skal i utgangspunktet ha få/ingen avhengigheter utanom
typescript koden som blir generert ut frå openapi spesifikasjonen til aktuell server.

I første omgang re-eksporterer den alt frå @navikt/k9-sak-typescript-client under _k9-sak/generated_, så for å bruke kode
derifrå er det tenkt at ein importerer det frå `@k9-sak-web/backend/k9sak/generated`

Eksempel:
```typescript
import { ApiError, K9SakClient, OrganisasjonsEnhet } from '@k9-sak-web/backend/k9sak/generated';
```


### Lokal k9-sak-typescript-client bruk

Viss ein skal jobbe med ein api definisjon som endå ikkje er på master branch i k9-sak, og dermed ikkje har blitt publisert
i _k9-sak-typescript-client_ pakke endå, kan ein klone k9-sak-typescript-client repo, køyre kodegenerator lokalt der, og bruke
yarn link for å bruke den lokale versjonen medan ein utvikler frontend. Meir info her: https://github.com/navikt/k9-sak-typescript-client

Med working directory i samme katalog som denne readme, bruk ein slik kommando for å få dette til:

```shell
yarn link ~/devel/k9-sak-typescript-client
```

Juster filstien slik at den stemmer med der du har klona k9-sak-typescript-client til.

**NB:** Hugs å fjerne link igjen før du committer, slik at endringa i package.json _"resolutions"_ ikkje blir med ut.

```shell
yarn unlink @navikt/k9-sak-typescript-client
```
**NB2:** Etter _yarn link_ eller _yarn unlink_ må vite restartast for å få med seg endringa i avhengighet.
