<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Clock;

interface ClockInterface
{
    public function now(): \DateTimeImmutable;
}
