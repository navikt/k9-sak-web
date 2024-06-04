Check compat typescript client
==============================

Denne action er meint brukt frå build pipelines i feks k9-sak, til å sjekke at ny generert typescript klient pakke er kompatibel med noverande (master) k9-sak-web kode.

Dette slik at endringer i backend som sannynligvis vil føre til feil i frontend blir oppdaga før utrulling til produksjon.
