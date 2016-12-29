<?php

require __DIR__.'/../../../bootstrap.php';
umask(0007);

use Symfony\Component\HttpFoundation\Request;
use Imatic\Bundle\ViewBundle\Tests\Fixtures\TestProject\TestKernel;

$_SERVER['PHP_AUTH_USER'] = 'user';
$_SERVER['PHP_AUTH_PW'] = 'password';

$kernel = new TestKernel();
$kernel->loadClassCache();

$request = Request::createFromGlobals();
Request::enableHttpMethodParameterOverride();
$response = $kernel->handle($request);
$response->send();
$kernel->terminate($request, $response);
