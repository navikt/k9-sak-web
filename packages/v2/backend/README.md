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
