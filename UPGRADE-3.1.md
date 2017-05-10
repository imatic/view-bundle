Upgrade na verzi 3.1
====================

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
