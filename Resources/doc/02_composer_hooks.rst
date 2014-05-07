Composer hooks
==============

Available composer commands:

``composer.json``::

    "scripts": {
        "post-install-cmd": [
            "Imatic\\Bundle\\ViewBundle\\Composer\\ScriptHandler::npmInstall",
            "Imatic\\Bundle\\ViewBundle\\Composer\\ScriptHandler::bowerMerge",
            "Imatic\\Bundle\\ViewBundle\\Composer\\ScriptHandler::bowerInstall",
            "Imatic\\Bundle\\ViewBundle\\Composer\\ScriptHandler::dumpAssets"
        ],
        "post-update-cmd": [
            "Imatic\\Bundle\\ViewBundle\\Composer\\ScriptHandler::npmInstall",
            "Imatic\\Bundle\\ViewBundle\\Composer\\ScriptHandler::bowerMerge",
            "Imatic\\Bundle\\ViewBundle\\Composer\\ScriptHandler::bowerInstall",
            "Imatic\\Bundle\\ViewBundle\\Composer\\ScriptHandler::dumpAssets"
        ]
    },


Bower merge
-----------

The ``ScriptHandler::bowerMerge`` command searches all bundles registered
in the application for ``bower.json`` file and merges them into the project's
``bower.json`` file. Useful information is printed to the console.
