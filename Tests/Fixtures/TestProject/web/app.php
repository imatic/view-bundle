<?php declare(strict_types=1);

if (PHP_SAPI === 'cli-server' && file_exists(__DIR__ . $_SERVER['REQUEST_URI'])) {
    return false;
}

require __DIR__ . '/../../../bootstrap.php';
\umask(0007);

use Imatic\Bundle\ViewBundle\Tests\Fixtures\TestProject\TestKernel;
use Symfony\Component\HttpFoundation\Request;

$_SERVER['PHP_AUTH_USER'] = 'user';
$_SERVER['PHP_AUTH_PW'] = 'password';

$kernel = new TestKernel();
$request = Request::createFromGlobals();
Request::enableHttpMethodParameterOverride();
$response = $kernel->handle($request);
$response->send();
$kernel->terminate($request, $response);
