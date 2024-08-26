k9-sak-web v2/
==============

All kode under her blir kontrollert med strengare tsconfig.json oppsett enn resten av kodebasen.

## Oversikt kataloger

- _v2/backend:_ Typescript kode for kommunikasjon med backend servere, og datatyper for dette. [Sjå backend/README for meir info](backend/README.md)
- _v2/gui:_ React kode for brukergrensesnittet plasserast her. [Sjå gui/README for meir info](gui/README.md)

Etter at du har lest info under bør du sjå gjennom readme filene referert over.

## Teknisk retning

For kode under v2/ ønsker vi å følge disse prinsipp:

### imports
Bruk moderne **exports clause i package.json**. Med dette kan vi ha færre toppnivå pakker som eksporterer eit hierarki av moduler.
Så istadenfor å importere frå det som er eksportert frå index.ts i ein pakke importerer vi direkte frå fil:
```typescript
import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
```
Sjå korleis dette er gjort allereie i _v2/gui_ for eksempel.

Vi unngår med dette namnekonflikter, får raskare bygg og sannsynlegvis betre tree-shaking av resultatet.

Viss ein ønsker det kan ein og lage tydeleg definerte "barrel files" som re-eksporterer innafor dette oppsettet. Eit tenkt eksempel kan sjå slik ut:
```typescript
import type { FagsakYtelsesType, Språkode } from '@k9-sak-web/backend/k9sak/kodeverk/types.js';
```

_v2/backend/src/k9sak/kodeverk/types.ts_ ser då slik ut:

```typescript
export type { FagsakYtelsesType } from './FagsakYtelsesType.js'
export type { Språkkode } from './Språkkode.js'
```

Vi skal og bruke **.js som suffiks i imports**, ikkje .ts. Dette er det anbefalte for moderne typescript oppsett, for best
mulig framtidig kompatiblitet.

### Backend kommunikasjon
For kode i v2 skal vi bruke api kode frå v2/backend, som igjen er generert frå openapi spesifikasjon til k9-sak backend og k9-tilbake.

Dette betyr at vi ikkje bruker den gamle rest-api koden, og ikkje ser på (HATEOAS) link info returnert i api responser slik den gamle rest-api koden gjere.
Dette vil gjere det lettare å ut frå frontend koden sjå kvar i backend data blir henta frå/sendt til.

Vi får med dette automatisk genererte korrekte typescript datatyper for input og resultat frå backend. Url og http metode for kall blir og
automatisk propagert frå serverdefinisjon til typescript. Vi kan og bruke metadata om validering på server-endepunktet som automatisk blir
propagert til typescript.

Dette forutsetter at backend kode har korrekte annotasjoner/typeinfo eksponert slik at openapi spesifikasjonen blir generert
med korrekte spesifikke typer. Viss dette ikkje er tilfelle må ein fikse backend definisjonen slik at ein får ein korrekt
typescript klientkode generert ut frå denne.

Sjå eksisterande kode i v2/gui og v2/backend for eksempel på korleis dette kan gjerast.

### Storybook/testing

For testing av react kode ønsker vi å skrive testane som ein del av stories i storybook. Dette gjev enklare utvikling
av testane, ein kan enklare sjå evt feil direkte i storybook i nettlesaren istadenfor å måtte sjå gjennom DOM output i konsollen.
Det blir og enklare å vise brukergrensesnittets design oppførsel til andre når ein har gode storybook scenario.

Vurder og å lage "fake backend" for å få testa komponenter sin oppførsel meir interaktivt istadenfor berre statiske mocks.
Ved å lage ein fake backend basert på klient og datatyper generert frå openapi får ein også lettare holdt disse oppdatert
når backend blir endra. Sjå eksempel på korleis dette kan gjerast i _v2/gui/src/sak/meldinger/Messages.stories.tsx_

### Unngå unødvendig kompleksitet

Vi har bestemt at ny kode for saksbehandlingsløysinga skal ikkje ha støtte for ulike språk. Så gammal intl kode fjernast ved omskriving.

### Forbetre kodekvaliteten og vedlikeholdbarhet

Unngå å ukritisk kopiere inn gammal kode. Prøv å forenkle og forbetre lesbarhet. Gå over til standardisert aksel kode istadenfor
gamle ft-frontend komponenter.

Bruk autogenererte typer og konstanter frå _v2/backend_ istadenfor å kopiere inn gammal kode for serverdatatyper, som kan
vere utdaterte og dupliserte. Viss det som er autogenerert frå openapi spesifikasjonen til serveren ikkje stemmer, forbetre
openapi definisjonen i backend koden istadenfor å lage eigen typescript kode som manuelt dupliserer backend kode.
