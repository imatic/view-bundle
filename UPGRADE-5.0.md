UPGRADE FROM 4.x to 5.0
=======================

Menu
----
*  Multiple level menu's is not currently supported by bootstrap 4

* `Imatic\Bundle\ViewBundle\Menu\Helper::setBadge()` last attribute `$right` was removed

* `Imatic\Bundle\ViewBundle\Menu\Helper::setIcon()` last attribute `$right` was removed

* `Imatic\Bundle\ViewBundle\Menu\Helper::transChoice()` was removed, see https://symfony.com/doc/current/translation/message_format.html#pluralization 

* disabled must be set as link attribute

   Before:
   ```php
   $menu->addChild('Reference', ['route' => 'homepage'])->setAttribute('class', 'disabled');
   ```
  
   After:
   ```php
   $menu->addChild('Reference', ['route' => 'homepage'])->setLinkAttribute('class', 'disabled'); 
   ```
    
* Removed `Imatic\Bundle\ViewBundle\Menu\Helper::addDivider()` method, to set divider use item attribute

   Before:
   ```php
   $menu->addChild('Item', ['route' => 'homepage']);
   $helper->addDivider($menu);
   ```

   After:
   ```php
   // vertical divider is no longer supported
   // divider is usable only with dropdown menu
   $menu->addChild('Item', ['route' => 'homepage'])->setAttribute('divider', true);

* Removed `Imatic\Bundle\ViewBundle\Menu\Helper::addHeader()` method, to set menu header use just text menu item

   Before:
   ```php
   $products = $menu->addChild('Products', ['route' => 'homepage']);
   $helper->addHeader($products, 'Products A');
   ```

   After:
   ```php
   $menu->addChild('Products', ['route' => 'homepage']);
   $menu->addChild('Products A',);
   ```
 
* Removed `Imatic\Bundle\ViewBundle\Menu\Helper::setSubmenu()` method, without any alternative

Icons
-----

* `Glyphicons` from Bootstram3 was replaced with `Font Awesome` 
    * affects `Imatic\Bundle\ViewBundle\Menu\Helper::setIcon()` method
