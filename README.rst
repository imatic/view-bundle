ImaticViewBundle
================

Installation
------------

1. Download ImaticViewBundle using composer

.. sourcecode:: yaml

    "require": {
        # ...
        "imatic/view-bundle": "dev-master"
    }

2. Enable the bundle

.. sourcecode:: php

    <?php
    // app/AppKernel.php

    public function registerBundles()
    {
        $bundles = array(
            // ...
            new Imatic\Bundle\ViewBundle\ImaticViewBundle(),
        );
    }

3. Configure the bundle

.. sourcecode:: yaml

    # app/config/config.yml

    imatic_view:
        templates:
            remote:
    #          example_remote_template:
    #              url: "http://example.com/remote-layout.html"
    #              ttl: 86400 # defaults to 24 hours
    #              blocks:
    #                  title: { placeholder: "@@page_title@@" }
    #                  content: { placeholder: "@@page_content@@" }
    #              metadata:
    #                foo: "bar" # will be available as _remote.foo inside the template


Remote templates
----------------

This bundle provides functionality to load Twig templates from a remote source.

See the example in the bundle configuration above.

Custom metadata
^^^^^^^^^^^^^^^

Any custom values set under the "metadata" key of each template will be available
inside that template as an object called "_remote".


TODO
----

Component
^^^^^^^^^
- form groups
- show groups
- nested shows
- show/form/table simple configuration (simple 1D array of keys)