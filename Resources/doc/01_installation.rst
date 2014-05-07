Installation
============

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
