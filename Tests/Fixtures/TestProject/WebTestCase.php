<?php
namespace Imatic\Bundle\ViewBundle\Tests\Fixtures\TestProject;

use Imatic\Bundle\TestingBundle\Test\WebTestCase as BaseWebTestCase;

/**
 * @author Miloslav Nenadal <miloslav.nenadal@imatic.cz>
 */
class WebTestCase extends BaseWebTestCase
{
    /**
     * @return string
     */
    protected static function getKernelClass()
    {
        return 'Imatic\Bundle\ViewBundle\Tests\Fixtures\TestProject\TestKernel';
    }
}
