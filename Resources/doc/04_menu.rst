Menu
====

This bundle integrates with `KnpMenuBundle <https://github.com/KnpLabs/KnpMenuBundle>`_
to create object oriented menus that are configured through an event listener.

Example
-------

Twig template
^^^^^^^^^^^^^

::

    {% import 'ImaticViewBundle:Component:menu.html.twig' as menu %}

    {{ menu.menu('imatic.example') }}


Event listener
^^^^^^^^^^^^^^

The definiton:

.. sourcecode:: yaml

    app_example.event_listener.menu:
        class: App\Bundle\ExampleBundle\EventListener\MenuListener
        tags:
            - { name: kernel.event_listener, event: imatic_view.configure_menu.imatic.example, method: onConfigureMenu }

The implemetation:

.. sourcecode:: php

    <?php

    namespace App\Bundle\ExampleBundle\EventListener;

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
