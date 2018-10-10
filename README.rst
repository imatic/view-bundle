.. image:: https://secure.travis-ci.org/imatic/view-bundle.png?branch=master
   :alt: Build Status
   :target: http://travis-ci.org/imatic/view-bundle
|
.. image:: https://img.shields.io/badge/License-MIT-yellow.svg
   :alt: License: MIT
   :target: LICENSE

ImaticViewBundle
================

See *Resources/doc/index.rst* for documentation.

Build Process
-------------

In case any asset sources are changed run ``yarn build`` command which will compile them.
Any compiled assets are commited with project. Build process is provided by standard webpack configuration.
More details can be found in ``webpack.config.js``.

Extending ExpressionLanguage
----------------------------

Bundle ExpressionLanguage can be extended easily extended. To do so, you can create a new expression provider tagged
with ``imatic_view.expression_language_provider``.

.. sourcecode:: php

    use Symfony\Component\ExpressionLanguage\ExpressionFunction;
    use Symfony\Component\ExpressionLanguage\ExpressionFunctionProviderInterface;

   <?php

    class ExpressionLanguageProvider implements ExpressionFunctionProviderInterface
    {
        public function getFunctions()
        {
            return [
                new ExpressionFunction(
                    'myFunction',
                    function () {
                        // ...
                    },
                    function () {
                        // ...
                    }
                ),
            ];
        }
    }

.. sourcecode:: yaml

   services:
       ExpressionLanguageProvider:
           tags:
               - { name: imatic_view.expression_language_provider }
