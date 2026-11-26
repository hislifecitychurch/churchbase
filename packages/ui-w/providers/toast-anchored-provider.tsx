import { Toast } from "@base-ui/react/toast"

import { ToastsAnchored } from "@packages/ui-w/shared/toast/toast-anchored"

export const toastAnchoredManager: ReturnType<typeof Toast.createToastManager> =
  Toast.createToastManager()

export interface ToastsAnchoredProviderProps extends Toast.Provider.Props {
  portalProps?: React.ComponentProps<typeof Toast.Portal>
}

export function ToastsAnchoredProvider({
  children,
  portalProps,
  ...props
}: ToastsAnchoredProviderProps): React.ReactElement {
  return (
    <Toast.Provider toastManager={toastAnchoredManager} {...props}>
      {children}
      <ToastsAnchored portalProps={portalProps} />
    </Toast.Provider>
  )
}
