<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Clock;

final class SystemClock implements ClockInterface
{
    public function now(): \DateTimeImmutable
    {
        return new \DateTimeImmutable();
    }
}
