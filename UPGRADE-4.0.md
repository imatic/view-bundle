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

* services are now private
    * imatic_view.menu.provider_container
    * imatic_view.menu.factory
    * imatic_view.menu.factory.array_loader
    * imatic_view.menu.factory.node_loader
    * imatic_view.menu.helper
    