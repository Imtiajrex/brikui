import * as React from 'react';
import { Pressable, Text as RNText } from 'react-native';
import { cn } from '../../lib/utils/utils';
import { Input } from '../input';
import type { InputProps } from '../input';

type PasswordInputProps = Omit<InputProps, 'rightSection'> & {
  rightSection?: React.ReactNode; // allow override; default shows Show/Hide
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  toggleClassName?: string;
  showNode?: React.ReactNode;
  hideNode?: React.ReactNode;
};

const Toggle = ({
  visible,
  setVisible,
  onVisibleChange,
  toggleClassName = 'text-xs text-muted-foreground',
  hideNode,
  showNode,
}: {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onVisibleChange?: (visible: boolean) => void;
  toggleClassName?: string;
  hideNode?: React.ReactNode;
  showNode?: React.ReactNode;
}) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={visible ? 'Hide password' : 'Show password'}
    onPress={() => {
      setVisible((v) => {
        const nv = !v;
        onVisibleChange?.(nv);
        return nv;
      });
    }}
  >
    {visible ? hideNode : showNode}
  </Pressable>
);

const PasswordInput = React.forwardRef<React.ComponentRef<typeof Input>, PasswordInputProps>(
  (
    {
      rightSection,
      defaultVisible = false,
      onVisibleChange,
      toggleClassName,
      showNode = <RNText className="text-xs text-primary">Show</RNText>,
      hideNode = <RNText className="text-xs text-primary">Hide</RNText>,
      ...props
    },
    ref
  ) => {
    const [visible, setVisible] = React.useState(defaultVisible);

    return (
      <Input
        ref={ref as any}
        secureTextEntry={!visible}
        autoComplete={(props as any).autoComplete ?? 'password'}
        textContentType={(props as any).textContentType ?? ('password' as any)}
        rightSection={
          rightSection ?? (
            <Toggle
              setVisible={setVisible}
              onVisibleChange={onVisibleChange}
              toggleClassName={toggleClassName}
              hideNode={hideNode}
              showNode={showNode}
              visible={visible}
            />
          )
        }
        {...props}
      />
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
export type { PasswordInputProps };
