package pl.pistolrange.pistolrange_server.domain;

public enum WeaponLawCategory {
    WSZYSTKIE("WSZYSTKIE"),
    USTAWA_O_BRONI_I_AMUNICJI("USTAWA_O_BRONI_I_AMUNICJI"),
    PRZECHOWYWANIE_I_NOSZENIE_BRONI ("PRZECHOWYWANIE_I_NOSZENIE_BRONI"),
    PRZEWOZENIE_BRONI_SRODKAMI_TRANSPORTU_PUBLICZNEGO("PRZEWOZENIE_BRONI_SRODKAMI_TRANSPORTU_PUBLICZNEGO"),
    BEZPIECZENSTWO_NA_STRZELNICACH("BEZPIECZENSTWO_NA_STRZELNICACH"),
    SANKCJE_KARNE("SANKCJE_KARNE"),
    OBRONA_KONIECZNA_I_STAN_WYZSZEJ_KONIECZNOSCI("OBRONA_KONIECZNA_I_STAN_WYZSZEJ_KONIECZNOSCI");

    private final String description;

    WeaponLawCategory(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
