// invalidTextRegex er brukt til validering av fritekst felt.
// Merk at denne er strengere enn validering i backend i nokre tilfeller.
// Den kan dermed sannsynlegvis opnast opp ein god del viss ønskelig, men ein ting å tenkje på i såfall er at [] teikn
// ikkje er tillatt pr no, og viss ein tillater det kan det føre til at saksbehandler utan å få feil kan sende brev der
// "placeholder" markeringer som bruker [ og ] teikn ikkje er redigert, og dermed kan det føre til at ufullstendige brev
// blir sendt. Dette bør derfor avklarast nærmare før ein evt tillater [] teikn i denne valideringa.
export const invalidTextRegex =
  /[^0-9a-zA-ZæøåÆØÅAaÁáBbCcČčDdĐđEeFfGgHhIiJjKkLlMmNnŊŋOoPpRrSsŠšTtŦŧUuVvZzŽžéôèÉöüäÖÜÄ .'\-‐–‑/%§!?@_()#+:;,="&\s<>~*]/g;
