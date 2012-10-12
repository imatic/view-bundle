<?php

namespace Imatic\Bundle\ViewBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;

class ImaticViewBundle extends Bundle
{
    public function getParent()
    {
        return 'TwigBundle';
    }
}
