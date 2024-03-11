k9-sak-web/gui
==============

Denne pakken er meint å innehalde kode som utgjere brukergrensesnittet til k9-sak.

Stort sett skal all kode som er avhengig av React og som ikkje brukast i andre system leggast inn her.

For å eksportere moduler ut frå denne pakken, juster `"exports"` klausulen i `package.json` viss nødvendig. På den måten
kan ein bygge opp ein hierarkisk pakkestruktur som ekstern kode kan importere frå.


### Importer med filending .js

Merk at for å importere kode frå denne pakken må du bruke **.js** filending i import klausul. Dette sidan exports er satt
opp utan mapping til ei bestemt filending, slik at ein kan importere andre filtyper enn javascript i framtida. Det såg
og ut til at ein fekk betre code completion i IDE ved å gjere det slik.

Eksempel:
```typescript
import MeldingerBackendClient from '@k9-sak-web/gui/sak/meldinger/MeldingerBackendClient.js';
```
_.ts_, _.tsx_ og _.jsx_ fungerer og, men _.js_ er anbefalt.

For å få dette mest mulig automatisk i Intellij kan ein sette innstilling _Settings => Code style => Typescript => Imports => Use file extension_ til _always .js_
