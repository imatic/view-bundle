Upgrade na verzi 3.0
====================

## Konfigurace aplikace

- smazat `GenemuFormBundle` z AppKernel
- smazat konfiguraci `genemu_form` z `config.yml` (jakakoliv nastaveni select2 presunout pod `imatic_form.select2`)
- smazat import `@ImaticViewBundle/Resources/config/config.yml`

# Twig sablony

- smazat volani `form_stylesheet()`
- zmenit volani `form_javascript()` na `imatic_form_javascript()`
  (`form_javascript()` prozatim bude fungovat, ale je to deprecated alias)
- `imatic_form_javascript_prototype()` se prejmenovalo na `imatic_form_javascript_prototypes()`
- `number` format jiz nebere ohled na nastaveni twigu (jelikoz se uz interne nepouziva)
    - options decimal, decimalPoint a thousandSep stale funguji
