import * as React from 'react';
import { Pressable, Text as RNText, TextInput, View } from 'react-native';
import { cn } from '../../lib/utils/utils';

type PinInputBaseProps = {
  length?: number;
  type?: 'number' | 'alphanumeric';
  mask?: boolean;
  maskDelay?: number; // ms to show last typed char before masking
  placeholder?: string; // a single char used when empty
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

type PinInputProps = PinInputBaseProps & {
  className?: string; // wrapper
  boxClassName?: string; // each cell
  charClassName?: string; // text inside each cell
};

const dims = {
  xs: { box: 28, radius: 6, font: 12, gap: 6 },
  sm: { box: 32, radius: 6, font: 14, gap: 8 },
  md: { box: 40, radius: 8, font: 16, gap: 10 },
  lg: { box: 48, radius: 10, font: 18, gap: 12 },
  xl: { box: 56, radius: 12, font: 20, gap: 14 },
} as const;

const sanitize = (val: string, type: 'number' | 'alphanumeric') => {
  const only = type === 'number' ? val.replace(/[^0-9]/g, '') : val.replace(/[^a-zA-Z0-9]/g, '');
  return only;
};

type Ctx = {
  length: number;
  value: string;
  chars: string[];
  placeholder: string;
  mask: boolean;
  revealIndex: number | null;
  disabled: boolean;
  error: boolean;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  dims: (typeof dims)[keyof typeof dims];
  focus: () => void;
};

const PinInputContext = React.createContext<Ctx | null>(null);

const PinInputRoot = React.forwardRef<
  TextInput,
  PinInputBaseProps & { className?: string; children?: React.ReactNode }
>(
  (
    {
      length = 4,
      type = 'number',
      mask = false,
      maskDelay = 350,
      placeholder = '○',
      value,
      defaultValue = '',
      onChange,
      onComplete,
      disabled = false,
      error = false,
      autoFocus = false,
      size = 'md',
      className,
      children,
    },
    ref
  ) => {
    const inputRef = React.useRef<TextInput>(null);
    React.useImperativeHandle(ref, () => inputRef.current as TextInput);

    const [internal, setInternal] = React.useState(() =>
      sanitize(defaultValue, type).slice(0, length)
    );
    const val = value != null ? sanitize(value, type).slice(0, length) : internal;
    const chars = Array.from({ length }, (_, i) => val[i] ?? '');

    // reveal last typed character briefly when mask=true
    const [revealIndex, setRevealIndex] = React.useState<number | null>(null);
    const revealTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const onChangeInternal = (nextRaw: string) => {
      const next = sanitize(nextRaw, type).slice(0, length);
      // determine if character was appended
      const appended = next.length > val.length;
      if (appended && mask) {
        const idx = next.length - 1;
        setRevealIndex(idx);
        if (revealTimer.current) clearTimeout(revealTimer.current);
        revealTimer.current = setTimeout(() => setRevealIndex(null), maskDelay);
      } else if (!appended) {
        // on delete or replace, clear reveal
        if (revealTimer.current) clearTimeout(revealTimer.current);
        setRevealIndex(null);
      }
      if (value == null) setInternal(next);
      onChange?.(next);
      if (next.length === length) onComplete?.(next);
    };

    React.useEffect(() => {
      return () => {
        if (revealTimer.current) clearTimeout(revealTimer.current);
      };
    }, []);

    const focus = () => {
      if (disabled) return;
      inputRef.current?.focus();
    };

    const d = dims[size];

    return (
      <PinInputContext.Provider
        value={{
          length,
          value: val,
          chars,
          placeholder,
          mask,
          revealIndex,
          disabled,
          error,
          size,
          dims: d,
          focus,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="PIN input"
          className={cn('flex-row items-center', className)}
          onPress={focus}
          disabled={disabled}
        >
          <TextInput
            ref={inputRef}
            value={val}
            onChangeText={onChangeInternal}
            editable={!disabled}
            keyboardType={type === 'number' ? 'number-pad' : 'default'}
            textContentType={type === 'number' ? ('oneTimeCode' as any) : ('none' as any)}
            autoCapitalize="none"
            autoCorrect={false}
            caretHidden
            autoFocus={autoFocus}
            maxLength={length}
            // visually hidden but keeps accessibility and focus
            style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
          />
          {/** children (cells) rendered by consumers or our convenience wrapper */}
          <View className="flex-row items-center">{children}</View>
        </Pressable>
      </PinInputContext.Provider>
    );
  }
);

const usePinInput = () => {
  const ctx = React.useContext(PinInputContext);
  if (!ctx) throw new Error('PinInput components must be used within <PinInputRoot />');
  return ctx;
};

type PinInputCellProps = {
  index: number;
  className?: string;
  textClassName?: string;
  style?: any;
};

const PinInputCell = ({ index, className, textClassName, style }: PinInputCellProps) => {
  const ctx = usePinInput();
  const { dims: d } = ctx;
  const c = ctx.chars[index] ?? '';
  const filled = c.length > 0;
  const shouldMask = ctx.mask && filled && ctx.revealIndex !== index;
  // If empty, never show mask; use placeholder and tint it muted
  const placeholderChar = ctx.mask && !filled && ctx.placeholder === '•' ? '○' : ctx.placeholder;
  const show = filled ? (shouldMask ? '•' : c) : placeholderChar;
  return (
    <View
      className={cn(
        'border bg-background items-center justify-center',
        ctx.disabled ? 'opacity-60' : '',
        ctx.error ? 'border-destructive' : 'border-input',
        className
      )}
      style={[{ width: d.box, height: d.box, borderRadius: d.radius }, style]}
    >
      <RNText
        className={cn(filled ? 'text-foreground' : 'text-muted-foreground', textClassName)}
        style={{ fontSize: d.font, lineHeight: d.font * 1.2 }}
      >
        {show}
      </RNText>
    </View>
  );
};

// Convenience: renders a row of cells with gap and manages input internally
const PinInput = React.forwardRef<TextInput, PinInputProps>((props, ref) => {
  const { className, boxClassName, charClassName, length = 4, size = 'md', ...rest } = props;
  const gap = dims[size].gap;
  return (
    <PinInputRoot ref={ref} length={length} size={size} className={className} {...rest}>
      <PinInputRow gap={gap} boxClassName={boxClassName} charClassName={charClassName} />
    </PinInputRoot>
  );
});

// We cannot pass children into PinInputRoot above via TS without changing its signature.
// So we augment PinInputRoot to render children via a dedicated Row component.

type PinInputRowProps = { gap?: number; boxClassName?: string; charClassName?: string };
const PinInputRow = ({ gap, boxClassName, charClassName }: PinInputRowProps) => {
  const ctx = usePinInput();
  const g = gap ?? ctx.dims.gap;
  return (
    <View className="flex-row items-center">
      {Array.from({ length: ctx.length }).map((_, i) => (
        <PinInputCell
          key={i}
          index={i}
          className={boxClassName}
          textClassName={charClassName}
          style={{ marginRight: i !== ctx.length - 1 ? g : 0 }}
        />
      ))}
    </View>
  );
};

// Re-export names in a compound API style
PinInputRoot.displayName = 'PinInputRoot';
PinInputCell.displayName = 'PinInputCell';
PinInput.displayName = 'PinInput';

export { PinInput, PinInputRoot, PinInputCell, PinInputRow };
export type { PinInputProps, PinInputBaseProps, PinInputCellProps };
