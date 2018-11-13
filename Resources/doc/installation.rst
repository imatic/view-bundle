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

    # config/packages/imatic_view.yaml
    imatic_view:
        formatters:
            intl:
                # overrides default formats (see Templating/Helper/Format/IntlFormatter.php)
                date_pattern_overrides:
                    cs.date.short: 'dd.MM.y'
                    cs.datetime.short:short: 'dd.MM.y H:mm'
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
