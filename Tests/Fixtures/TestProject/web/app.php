<?php declare(strict_types=1);

use Imatic\Bundle\ViewBundle\Tests\Fixtures\TestProject\TestKernel;
use Symfony\Component\ErrorHandler\Debug;
use Symfony\Component\HttpFoundation\Request;

require __DIR__ . '/../../../bootstrap.php';

\umask(0000);
Debug::enable();

$_SERVER['PHP_AUTH_USER'] = 'user';
$_SERVER['PHP_AUTH_PW'] = 'password';

$kernel = new TestKernel();

$request = Request::createFromGlobals();
Request::enableHttpMethodParameterOverride();
$response = $kernel->handle($request);
$response->send();
$kernel->terminate($request, $response);
