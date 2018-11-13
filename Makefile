SHELL := /usr/bin/env bash

.PHONY: test
test: phpunit phpmd phpcs

.PHONY: phpcs
phpcs:
	./vendor/bin/php-cs-fixer fix --dry-run

.PHONY: phpmd
phpmd:
	./vendor/bin/phpmd $$((\
		find * -maxdepth 0 -not -name 'vendor' -not -name 'Tests' -type d && \
		find Tests/ -mindepth 1 -maxdepth 1 -not -name 'Fixtures' && \
		find Tests/Fixtures/ -mindepth 2 -maxdepth 2 -not -name 'cache' -not -name 'logs'\
		) | paste --delimiter , --serial) text phpmd.xml

.PHONY: phpunit
phpunit:
	LC_ALL='C.UTF-8' ./vendor/bin/phpunit

composer:
	$(if $(shell which composer 2> /dev/null),\
        ln --symbolic $$(which composer) composer,\
		curl --silent --show-error https://getcomposer.org/installer | php -- --install-dir=$$(pwd) --filename=composer)

.PHONY: update-test
update-test: | composer
	rm -rf Tests/Fixtures/TestProject/cache/test/
	./composer install

.PHONY: configure-pipelines
configure-pipelines:
	apt-get update
	apt-get install --yes git graphviz
