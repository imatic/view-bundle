.PHONY: test
test:
	LC_ALL='C.UTF-8' ./vendor/bin/phpunit

composer:
ifeq ($(shell which composer 2> /dev/null),)
	curl --silent --show-error https://getcomposer.org/installer | php -- --install-dir=$$(pwd) --filename=composer
else
	ln --symbolic $$(which composer) composer
endif

.PHONY: update-test
update-test: | composer
	./composer install

.PHONY: configure-pipelines
configure-pipelines:
	apt-get update
	apt-get install --yes git

