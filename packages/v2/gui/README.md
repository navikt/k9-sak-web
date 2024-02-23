k9-sak-web/gui
==============

Denne pakken er meint å innehalde kode som utgjere brukergrensesnittet til k9-sak.

Stort sett skal all kode som er avhengig av React og som ikkje brukast i andre system leggast inn her.

For å eksportere moduler ut frå denne pakken, juster `"exports"` klausulen i `package.json` viss nødvendig. På den måten
kan ein bygge opp ein hierarkisk pakkestruktur som ekstern kode kan importere frå.
