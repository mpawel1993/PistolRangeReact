-- USTAWA_O_BRONI_I_AMUNICJI
update questions q
set category  = 'USTAWA_O_BRONI_I_AMUNICJI'
where q.legacy_id between 0 and 145;

update questions q
set category  = 'USTAWA_O_BRONI_I_AMUNICJI'
where q.legacy_id between 154 and 158;

update questions q
set category  = 'USTAWA_O_BRONI_I_AMUNICJI'
where q.legacy_id between 164 and 169;


-- PRZECHOWYWANIE_I_NOSZENIE_BRONI

update questions q
set category  = 'PRZECHOWYWANIE_I_NOSZENIE_BRONI'
where q.legacy_id between 146 and 153;

-- PRZEWOZENIE_BRONI_SRODKAMI_TRANSPORTU_PUBLICZNEGO

update questions q
set category  = 'PRZEWOZENIE_BRONI_SRODKAMI_TRANSPORTU_PUBLICZNEGO'
where q.legacy_id between 159 and 163;

-- BEZPIECZENSTWO_NA_STRZELNICACH
update questions q
set category  = 'BEZPIECZENSTWO_NA_STRZELNICACH'
where q.legacy_id between 170 and 184;

-- SANKCJE_KARNE

update questions q
set category  = 'SANKCJE_KARNE'
where q.legacy_id between 185 and 193;

update questions q
set category  = 'SANKCJE_KARNE'
where q.legacy_id between 197 and 200;


-- OBRONA_KONIECZNA_I_STAN_WYZSZEJ_KONIECZNOSCI

update questions q
set category  = 'OBRONA_KONIECZNA_I_STAN_WYZSZEJ_KONIECZNOSCI'
where q.legacy_id between 194 and 196;
