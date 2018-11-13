<?php declare(strict_types=1);

use Doctrine\Common\Annotations\AnnotationRegistry;

if (\file_exists($loader_path = __DIR__ . '/../vendor/autoload.php')) {
    $loader = include $loader_path;
    AnnotationRegistry::registerLoader([$loader, 'loadClass']);
}
