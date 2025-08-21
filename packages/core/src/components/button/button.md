# Button

A theme-aware, brandable button built on React Native `Pressable` and Tailwind (via NativeWind). It uses Tailwind design tokens from the BrikUI Tailwind plugin, so updating your Tailwind color/radius config updates all Button styles automatically.

## Import

```tsx
import { Button } from 'brikui';
```

## Props

- variant: 'default' | 'secondary' | 'accent' | 'success' | 'destructive' | 'outline' | 'ghost' | 'link' | 'muted' (default: 'default')
- size: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | 'icon' (default: 'default')
- fullWidth?: boolean (stretches to container width)
- isLoading?: boolean (shows spinner; also disables the button)
- left?: React.ReactNode (leading adornment, e.g., icon)
- right?: React.ReactNode (trailing adornment, e.g., icon)
- ...React Native Pressable props (onPress, disabled, etc.)

The text color and background use brand tokens like `primary`, `secondary`, `accent`, etc., so your Tailwind configuration controls the entire look and feel.

## Theming

This component relies on tokens provided by the BrikUI Tailwind plugin:

- Colors: `primary`, `secondary`, `accent`, `success`, `destructive`, and `background`, `foreground`, `ring`, `input`, etc., including their `-foreground` variants.
- Radius: uses `rounded-radius` which maps to `theme.extend.borderRadius.radius` (often `var(--radius)`).

Update your `Colors` map or CSS variables in the Tailwind plugin to rebrand without touching component code.

## Usage

### Basic

```tsx
<Button onPress={() => {}}>Tap me</Button>
```

### Variants

```tsx
<View className="gap-3">
  <Button>Default</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="accent">Accent</Button>
  <Button variant="success">Success</Button>
  <Button variant="destructive">Destructive</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="link">Link</Button>
  <Button variant="muted">Muted</Button>
</View>
```

### Sizes

```tsx
<View className="gap-3">
  <Button size="xs">XS</Button>
  <Button size="sm">Small</Button>
  <Button size="default">Default</Button>
  <Button size="lg">Large</Button>
  <Button size="xl">XL</Button>
  <Button size="icon" accessibilityLabel="Settings">
    {/* icon here */}
  </Button>
</View>
```

### Full width

```tsx
<Button fullWidth onPress={() => {}}>
  Continue
</Button>
```

### Loading

```tsx
<Button isLoading onPress={() => {}}>
  Submitting…
</Button>
```

### With icons (left/right)

```tsx
// You can pass any React nodes as left/right, e.g., from lucide-react-native.
<Button
  left={<SomeIcon className="text-primary-foreground" />}
  right={<SomeIcon className="text-primary-foreground" />}
>
  With Icons
</Button>
```

### Customizing text styles

You can pass text-related classes via `className` and they’ll be extracted to the inner label automatically.

```tsx
<Button className="text-base tracking-wide">Custom text</Button>
```

## Accessibility

- Sets `accessibilityRole="button"`.
- When `isLoading` or `disabled` is true, the pressable is disabled.

## Notes

- For link-style actions (variant="link"), this is still a `Pressable`. Provide your own navigation handler in `onPress`.
- Avoid passing both `isLoading` and a long-running `onPress` without debouncing if you might trigger repeated presses.
