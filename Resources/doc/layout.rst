Layout
======

Twig templates
--------------

- ``@ImaticView/Layout/base.html.twig``

  - this is the main template that should be used and/or extended

  - it automatically includes the following assets:

    - bundles/imaticview/platform.css
    - bundles/imaticview/platform.js

  - these can be overriden by providing ``asset_bundle_name`` in case files are served from different location.

- ``@ImaticView/Layout/layout.html.twig``

  - full HTML page skeleton

- ``@ImaticView/Layout/action.html.twig``

  - layout-less action output


Behavior of ``base.html.twig``
------------------------------

If you use ``@ImaticView/Layout/base.html.twig``, the parent template
will be determined dynamically. The logic is as follows:

Use ``action.html.twig`` if any of the following conditions is met:

- the current request is a XmlHttpRequest (ajax)
- the request contains a ``_layout`` parameter set to ``"off"``
- the request is a sub-request

... otherwise, use ``layout.html.twig``.


HTTP headers
------------

If the conditions for ``action.html.twig`` are met, custom headers are created.

These are intended for use with JavaScript components.


Flash messages
^^^^^^^^^^^^^^

Session flash messages will be put into a custom HTTP header encoded as JSON.::

    X-Flash-Messages: [{"type": "string", "message": "string"}, ...]


Page titles
^^^^^^^^^^^

Page titles from the layout will be put into a custom HTTP header encoded as JSON.::

    X-Title: {"title": "string", "fullTitle": "string"}
