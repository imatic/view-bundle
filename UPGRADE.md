# 3.0

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
    
# Form typy

- `genemu_jqueryselect2_choice` (resp `Select2Type::class`) zmenit na choice

# 3.1

## Konfigurace assetu

- Pokud se pouziva base layout z viewbundle, prenastavit **asset_bundle_name**.
    - Nenastavovat vubec, pokud projekt neupravuje vychozi assety soubory platformy.
    - Nastavit na nazev bundle pokud se kompiluje jak css tak javascript.
    - Pokud se kompiluje jen css nebo jen javascript, pouzit override blocku v twig sablone
    (bloky javascripts a stylesheets) a v nem prolinkovat aplikacni bundles.
    
- Pro custom build assetu se zdrojove soubory porad daji najit v adresari **Resources**.
    - Namisto *config/webpack/platform.entry.js* pouzit *assets/platform.js*
    - Namisto *config/webpack/demo.entry.js* pouzit *assets/demo.js* (nepotrebne pro projekty)
    
- Pro buildeni pomoci webpacku, nastavit polozku require.resolve na `['node_modules', 'vendor']`
viz. *webpack.config.js* v hlavnim adresari tohohle bundle.
    - Pridani slozky vendor umoznuje nacitani assetu z composer balicku.
    - Priklad nacteni z form bundle: `require('imatic/form-bundle/Resources/public/js/Form');`
    - Priklad nacteni *platform.js*: `require('imatic/view-bundle/Resources/assets/platform.js');`
    - Priklad nacteni *platform.less*: `@import "~imatic/view-bundle/Resources/assets/platform.css";`
    (prefix ~ znaci ze se ma modul nacit pres webpack, mechanizmus less nezna rozdil mezi relativni
    a absolutni cestou)
    
- Pokud se buildi javascript z platformy pomoci webpacku pridat loader pro jQuery
    - jQuery jako taka se nacitana vicero mistech (v zavislostech) a proto je nutne
    vsude ji nahradit za jednu exposed globalni instanci. Toho je mozne docilit pomoci
    *expose-loader* configurace:
        ``` javascript
            /*
             * expose jQuery
             */
            {
                test: require.resolve('jquery'),
                use: [{
                    loader: 'expose-loader',
                    options: 'jQuery'
                },{
                    loader: 'expose-loader',
                    options: '$'
                }]
            }
        ```

# 4.0

## Changed

- `twig/twig` upgraded to version 2

