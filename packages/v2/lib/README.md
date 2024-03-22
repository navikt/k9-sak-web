# k9-sak-web/lib

Denne pakken inneholder utility-funksjoner for brukergrensesnittet til k9-sak.

Stort sett skal all kode som IKKE er avhengig av React og som ikke brukes av andre systemer legges her.

For å eksportere moduler ut fra denne pakken, juster `"exports"` klausulen i `package.json` hvis nødvendig. På den måten
kan en bygge opp ein hierarkisk pakkestruktur som ekstern kode kan importere fra.
