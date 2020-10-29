<?php declare(strict_types=1);
namespace Imatic\Bundle\ViewBundle\Templating\Helper\Format;

use Symfony\Component\PropertyAccess\Exception\UnexpectedTypeException;
use Symfony\Component\PropertyAccess\PropertyAccess;
use Symfony\Component\PropertyAccess\PropertyAccessor;
use Twig\Environment;

class FormatHelper implements FormatterInterface
{
    /**
     * @var FormatterInterface[]
     */
    private $formatters;

    /**
     * @var array[]
     */
    private $formatterOptions;

    /**
     * @var Environment
     */
    private $twig;

    /**
     * @var PropertyAccessor
     */
    private $accessor;

    public function __construct(Environment $twig)
    {
        $this->twig = $twig;
        $this->accessor = PropertyAccess::createPropertyAccessor();
    }

    /**
     * @param string             $format
     * @param FormatterInterface $formatter
     * @param array              $options
     */
    public function addFormatter($format, FormatterInterface $formatter, array $options = [])
    {
        $this->formatters[$format] = $formatter;
        $this->formatterOptions[$format] = $options;
    }

    /**
     * @param string $format
     * @param string $context templating context (e.g. "html")
     *
     * @return bool
     */
    public function isSafe($format, $context)
    {
        if (!isset($this->formatterOptions[$format])) {
            return false;
        }

        return $context === $this->formatterOptions[$format]['is_safe'];
    }

    /**
     * @param mixed  $value
     * @param string $format
     * @param array  $options
     *
     * @throws \InvalidArgumentException if the formatter doesn't exist
     *
     * @return string|null
     */
    public function format($value, $format = null, array $options = [])
    {
        if (null === $format) {
            $format = $this->guessFormat($value);
        }

        if (!empty($options['template'])) {
            return $this->twig->render(
                $options['template'],
                ['value' => $value, 'options' => $options, 'format' => $format] + $options
            );
        }

        if (!isset($this->formatters[$format])) {
            throw new \InvalidArgumentException(\sprintf('Formatter "%s" not found', $format));
        }

        return $this->formatters[$format]->format($value, $format, $options);
    }

    /**
     * @param array|object $objectOrArray
     * @param string|null  $propertyPath
     * @param string       $format
     * @param array        $options
     *
     * @return string|null
     */
    public function renderValue($objectOrArray, $propertyPath, $format = null, array $options = [])
    {
        if (\is_array($objectOrArray) && $propertyPath && $propertyPath[0] !== '[') {
            $propertyPath = \sprintf('[%s]', $propertyPath);
        }

        if (null === $propertyPath) {
            $value = $objectOrArray;
        } else {
            try {
                $value = $this->accessor->getValue($objectOrArray, $propertyPath);
                $options['object'] = $objectOrArray;
            } catch (UnexpectedTypeException $e) {
                // the property path could not be reached
                $value = null;
            }
        }

        if (!empty($options['collection']) && true === $options['collection']) {
            unset($options['collection']);
            $propertyPath = null;
            if (!empty($options['propertyPath'])) {
                $propertyPath = $options['propertyPath'];
            }

            return $this->twig->render('@ImaticView/Field/collection.html.twig', [
                'value' => $value,
                'options' => $options,
                'format' => $format,
                'propertyPath' => $propertyPath,
            ]);
        }

        return $this->format($value, $format, $options);
    }

    /**
     * @param mixed $value
     *
     * @throws \RuntimeException if the format could not be determined
     *
     * @return string
     */
    protected function guessFormat($value)
    {
        $format = null;
        $type = \gettype($value);

        switch ($type) {
            case 'boolean':
                $format = 'boolean';
                break;
            case 'integer':
            case 'double':
                $format = 'number';
                break;
            case 'string':
            case 'NULL':
            case 'resource':
                $format = 'text';
                break;
            case 'object':
                if ($value instanceof \DateTime) {
                    $format = 'datetime';
                } else {
                    $format = 'text';
                }
                break;
        }

        if (null === $format) {
            throw new \RuntimeException(\sprintf(
                'Could not guess format for a value of type "%s". Please provide a format.',
                $type
            ));
        }

        return $format;
    }
}
