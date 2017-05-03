Upgrade na verzi 3.1
====================

## Konfigurace assetu

- Namisto buildeni javascriptu z platformy pouzit uz zbuildeny soubor platform.js v assetech bundlu.
- Styly z bundle jsou taky predem skompilovany v souboru platform.css
- Pokud projekt pouziva custom less promenny nebo jinak modifikuje styly, pouzit soubor Resources/assets/platform.less
  jako zavislost.
