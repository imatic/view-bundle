<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Clock;

final class SymfonyClockAdapter implements ClockInterface
{
    public function __construct(
        private \Symfony\Component\Clock\ClockInterface $clock
    ) {
    }

    public function now(): \DateTimeImmutable
    {
        return $this->clock->now();
    }

    public function sleep(float|int $seconds): void
    {
        $this->clock->sleep($seconds);
    }

    public function withTimeZone(\DateTimeZone|string $timezone): static
    {
        return new self($this->clock->withTimeZone($timezone));
    }
}
