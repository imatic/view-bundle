Remote templates
================

This bundle provides functionality to load Twig templates from a remote source.

.. sourcecode:: yaml

    # app/config/config.yml

    imatic_view:
        templates:
            remote:
               example_remote_template: # this is full name of the template
                   url: "http://example.com/remote-layout.html"
                   ttl: 86400 # defaults to 24 hours
                   blocks:
                       title: { placeholder: "@@page_title@@" }
                       content: { placeholder: "@@page_content@@" }
                   metadata:
                       foo: "bar" # will be available as _remote.foo inside the template
