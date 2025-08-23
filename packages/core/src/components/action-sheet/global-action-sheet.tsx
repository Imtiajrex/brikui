import * as React from 'react';
import { create } from 'zustand';
import { Portal } from '../portal';
import { ActionSheet, type ActionSheetHandle, type ActionSheetProps } from './action-sheet';

export interface GlobalActionSheetShowOptions
  extends Omit<ActionSheetProps, 'open' | 'onOpenChange'> {
  onOpenChange?: (open: boolean) => void; // allow callback for user
}

interface GlobalActionSheetState {
  open: boolean;
  options: GlobalActionSheetShowOptions | null;
  show: (opts: GlobalActionSheetShowOptions) => void;
  hide: () => void;
}

const useGlobalActionSheetStore = create<GlobalActionSheetState>((set) => ({
  open: false,
  options: null,
  show: (opts) => set({ open: true, options: opts }),
  hide: () => set((s) => ({ ...s, open: false })),
}));

export const GlobalActionSheetRenderer: React.FC = () => {
  const { open, options, hide } = useGlobalActionSheetStore();
  const ref = React.useRef<ActionSheetHandle>(null);

  React.useEffect(() => {
    if (open) ref.current?.show();
    else ref.current?.hide();
  }, [open]);

  return (
    <ActionSheet
      ref={ref}
      {...options}
      onCancel={() => {
        options?.onCancel?.();
        hide();
      }}
      onOpenChange={(v) => {
        if (!v) hide();
        options?.onOpenChange?.(v);
      }}
    />
  );
};

interface GlobalActionSheetComponent
  extends React.ForwardRefExoticComponent<
    ActionSheetProps & React.RefAttributes<ActionSheetHandle>
  > {
  show: (opts: GlobalActionSheetShowOptions) => void;
  hide: () => void;
  Global: typeof GlobalActionSheetRenderer;
}

export const GlobalActionSheet: GlobalActionSheetComponent = Object.assign(
  React.forwardRef<ActionSheetHandle, ActionSheetProps>((props, ref) => (
    <ActionSheet ref={ref} {...props} />
  )),
  {
    show: (opts: GlobalActionSheetShowOptions) => useGlobalActionSheetStore.getState().show(opts),
    hide: () => useGlobalActionSheetStore.getState().hide(),
    Global: GlobalActionSheetRenderer,
  }
);

GlobalActionSheet.displayName = 'ActionSheet';

export const ActionSheetStore = { use: useGlobalActionSheetStore };
