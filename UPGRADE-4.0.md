UPGRADE FROM 3.x to 4.0
=======================
* dependency
    * support php >= 7.1
    * support symfony >= 3.4

* removed deprecated "link" formatter, "url" formatter with "text" option instead'

   Before:

   ```twig
   {{{ imatic_view_format('unused', 'link', {url: 'http://example.com/', name: 'open link'}) }}
   ```

   After:

   ```twig
   {{ imatic_view_format('http://example.com/', 'url', {text: 'open link'}) }}
   ```

Services
--------

* Configuration has been moved from .yml to .xml. 

    - `Resources/config/routing.yml` use `Resources/config/routing.xml`
    - `Resources/config/routing_demo.yml` use `Resources/config/routing_demo.xml`
    - `Resources/config/services.yml` use `Resources/config/services.xml`

* The following service aliases have been removed; use their fully-qualified class name instead:

    - `imatic_view.menu.factory` use `Imatic\Bundle\ViewBundle\Menu\Factory`
    - `imatic_view.menu.helper` use `Imatic\Bundle\ViewBundle\Menu\Helper`
    - `imatic_view.menu.provider_container` use `Imatic\Bundle\ViewBundle\Menu\ContainerProvider`
    - `imatic_view.templating.helper.format` use `Imatic\Bundle\ViewBundle\Templating\Helper\Format\FormatHelper`
    - `imatic_view.templating.helper.grid` use `Imatic\Bundle\ViewBundle\Templating\Helper\Grid\GridHelper`
    - `imatic_view.templating.helper.show` use `Imatic\Bundle\ViewBundle\Templating\Helper\Show\ShowHelper`
    - `imatic_view.templating.helper.layout` use `Imatic\Bundle\ViewBundle\Templating\Helper\Layout\LayoutHelper`
    - `imatic_view.templating.helper.action` use `Imatic\Bundle\ViewBundle\Templating\Helper\Action\ActionHelper`
    - `imatic_view.templating.helper.condition` use `Imatic\Bundle\ViewBundle\Templating\Helper\Condition\ConditionHelper`
    - `imatic_view.templating.helper.url` use `Imatic\Bundle\ViewBundle\Templating\Helper\Html\UrlHelper`
    - `imatic_view.templating.helper.html` use `Imatic\Bundle\ViewBundle\Templating\Helper\Html\HtmlHelper`
    - `imatic_view.templating.helper.resource` use `Imatic\Bundle\ViewBundle\Templating\Helper\Resource\ResourceHelper`
    - `imatic_view.twig.extension.format.intl` use `Imatic\Bundle\ViewBundle\Templating\Helper\Format\IntlFormatter`
    - `imatic_view.twig.extension.format.common` use `Imatic\Bundle\ViewBundle\Templating\Helper\Format\CommonFormatter`
        
* The following service aliases have been removed:

    - `imatic_view.menu.factory.array_loader`
    - `imatic_view.menu.factory.node_loader`    
    