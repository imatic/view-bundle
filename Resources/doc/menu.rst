Menu
====

This bundle integrates with `KnpMenuBundle <https://github.com/KnpLabs/KnpMenuBundle>`_
to create object oriented menus that are configured through an event listener.

Default MenuBuilder
-------------------

This bundle comes with predefined menu builder ``Imatic\Bundle\ViewBundle\Menu\MainMenuBuilder``. Menu can be easily
configured through EventListener.

Eventually default builder class can be overridden through service parameter ``imatic_view.menu.main.class``.

Event listener
^^^^^^^^^^^^^^

The definition:

.. sourcecode:: yaml

    # config/services.yaml
    App\Menu\MenuListener:
        tags:
            - { name: kernel.event_listener, event: imatic_view.configure_menu.imatic.main, method: onConfigureMenu }

The implementation:

.. sourcecode:: php

    // src/Menu/MenuListener.php
    <?php

    namespace App\Menu;

    use Imatic\Bundle\ViewBundle\Event\ConfigureMenuEvent;

    class MenuListener
    {
        public function onConfigureMenu(ConfigureMenuEvent $event)
        {
            $menu = $event->getMenu();
            $helper = $event->getHelper();

            $menu->addChild(
                $helper->trans('Foo', [], 'AppExampleBundleFoo'),
                ['route' => 'app_example_foo_list']
            );
        }
    }

Own MenuBuilder
---------------

Builder class
^^^^^^^^^^^^^

.. sourcecode:: php

    // src/Menu/AppMenuBuilder.php
    <?php

    namespace App\Menu;

    use Imatic\Bundle\ViewBundle\Menu\Factory;
    use Imatic\Bundle\ViewBundle\Menu\Helper;

    class AppMenuBuilder
    {
        public function getMenu(Factory $factory, Helper $helper)
        {
            $menu = $factory->createItem('root');

            return $menu;
        }
    }

Service registration
^^^^^^^^^^^^^^^^^^^^

.. sourcecode:: yaml

    # config/services.yaml
    App\Menu\AppMenuBuilder:
        public: true # builder must be public
        tags:
            - { name: imatic_view.menu, alias: app.menu, method: getMenu } # method is optional

Twig template
^^^^^^^^^^^^^

.. sourcecode:: twig

    {# templates/base.html.twig #}
    {% import '@ImaticView/Component/menu.html.twig' as menu %}

    {{ menu.menu('app.menu') }}


Event listener
^^^^^^^^^^^^^^

Every registered menu builder dispatch event imatic_view.configure_menu.{$alias} (e.g. imatic_view.configure_menu.app.menu).
