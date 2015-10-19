Layout
======

Twig templates
--------------

- ``ImaticViewBundle:Layout:base.html.twig``

  - this is the main template that should be used and/or extended

  - it automatically includes the following assets (``asset_bundle_name`` defaults to ``platform``):

    - assets/js/#{asset_bundle_name}.css
    - assets/js/#{asset_bundle_name}.js

- ``ImaticViewBundle:Layout:layout.html.twig``

  - full HTML page skeleton

- ``ImaticViewBundle:Layout:action.html.twig``

  - layout-less action output


Behavior of ``base.html.twig``
------------------------------

If you use ``ImaticViewBundle:Layout:base.html.twig``, the parent template
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
