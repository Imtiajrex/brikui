import * as React from 'react';
import { create } from 'zustand';
import { Portal } from '../portal';
import { AlertDialogBase, type AlertDialogHandle, type AlertDialogProps } from './alert-dialog';

export interface AlertDialogShowOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  confirm?: { text?: string; onAction?: () => void };
  cancel?: { text?: string; onAction?: () => void };
  disableBackdropClose?: boolean;
  animationDuration?: number;
  contentClassName?: string;
  overlayClassName?: string;
  containerClassName?: string;
}

interface GlobalAlertDialogState {
  open: boolean;
  options: AlertDialogShowOptions;
  show: (opts: AlertDialogShowOptions) => void;
  close: () => void;
}

const useGlobalAlertDialogStore = create<GlobalAlertDialogState>((set) => ({
  open: false,
  options: {},
  show: (opts) => set({ open: true, options: opts }),
  close: () => set((s) => ({ ...s, open: false })),
}));

export const GlobalAlertDialog: React.FC = () => {
  const { open, options, close } = useGlobalAlertDialogStore();
  const ref = React.useRef<AlertDialogHandle>(null);

  React.useEffect(() => {
    if (open) ref.current?.open();
    else ref.current?.close();
  }, [open]);

  const { title, description, confirm, cancel } = options;

  return (
    <Portal name="__global_alert_dialog__">
      <AlertDialogBase
        ref={ref}
        title={title}
        description={description}
        confirmText={confirm?.text}
        cancelText={cancel?.text}
        disableBackdropClose={options.disableBackdropClose}
        animationDuration={options.animationDuration}
        contentClassName={options.contentClassName}
        overlayClassName={options.overlayClassName}
        containerClassName={options.containerClassName}
        onConfirm={() => {
          confirm?.onAction?.();
          close();
        }}
        onCancel={() => {
          cancel?.onAction?.();
          close();
        }}
        onOpenChange={(isOpen) => {
          if (!isOpen) close();
        }}
      />
    </Portal>
  );
};

// Re-export a composed component with static helpers for convenience
interface AlertDialogComponent
  extends React.ForwardRefExoticComponent<
    AlertDialogProps & React.RefAttributes<AlertDialogHandle>
  > {
  show: (opts: AlertDialogShowOptions) => void;
  close: () => void;
  Global: typeof GlobalAlertDialog;
}

export const AlertDialog: AlertDialogComponent = Object.assign(
  React.forwardRef<AlertDialogHandle, AlertDialogProps>((props, ref) => (
    <AlertDialogBase ref={ref} {...props} />
  )),
  {
    show: (opts: AlertDialogShowOptions) => useGlobalAlertDialogStore.getState().show(opts),
    close: () => useGlobalAlertDialogStore.getState().close(),
    Global: GlobalAlertDialog,
  }
);

AlertDialog.displayName = 'AlertDialog';

export const AlertDialogStore = { use: useGlobalAlertDialogStore };
export * from './alert-dialog';
