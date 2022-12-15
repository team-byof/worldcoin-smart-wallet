import create from 'zustand'
import { IDKITStage } from '@/types'
import type { Config } from '@/types/Config'
import type { CallbackFn, ErrorState, IPhoneSignal } from '@/types'

export type IDKitStore = {
	code: string
	open: boolean
	actionId: string
	stage: IDKITStage
	autoClose: boolean
	phoneNumber: string
	copy: Config['copy']
	processing: boolean // Whether an async request is being processed and we show a loading state in the UI
	errorState: ErrorState | null
	successCallbacks: Array<CallbackFn>

	retryFlow: () => void
	setCode: (code: string) => void
	setOpen: (open: boolean) => void
	setStage: (stage: IDKITStage) => void
	setOptions: (options: Config) => void
	onOpenChange: (open: boolean) => void
	setActionId: (actionId: string) => void
	onSuccess: (result: IPhoneSignal) => void
	setProcessing: (processing: boolean) => void
	addSuccessCallback: (cb: CallbackFn) => void
	setPhoneNumber: (phoneNumber: string) => void
	setErrorState: (errorState: ErrorState | null) => void
}

const useIDKitStore = create<IDKitStore>()((set, get) => ({
	open: false,
	code: '',
	actionId: '',
	phoneNumber: '',
	autoClose: false,
	errorState: null,
	processing: false,
	successCallbacks: [],
	stage: IDKITStage.ENTER_PHONE,
	copy: {
		title: 'Verify Phone',
		heading: 'Verify your phone number to continue',
		subheading: "We'll take care of the rest!",
		success: 'Your phone number is now verified.',
	},

	setOpen: open => set({ open }),
	setCode: code => set({ code }),
	setStage: stage => set({ stage }),
	setActionId: actionId => set({ actionId }),
	setErrorState: errorState => set({ errorState }),
	setPhoneNumber: phoneNumber => set({ phoneNumber }),
	setProcessing: (processing: boolean) => set({ processing }),
	retryFlow: () => set({ stage: IDKITStage.ENTER_PHONE, phoneNumber: '' }),
	addSuccessCallback: (cb: CallbackFn) => set(state => ({ successCallbacks: [...state.successCallbacks, cb] })),
	setOptions: ({ onSuccess, actionId, autoClose, copy }: Config) => {
		set(store => ({
			actionId,
			autoClose,
			copy: { ...store.copy, ...copy },
		}))

		if (onSuccess) get().addSuccessCallback(onSuccess)
	},
	onSuccess: (result: IPhoneSignal) => {
		get().successCallbacks.map(cb => cb(result))
		set({ stage: IDKITStage.SUCCESS, processing: false })

		if (get().autoClose) setTimeout(() => set({ open: false }), 1000)
	},
	onOpenChange: open => {
		if (open) return set({ open })
		set({ open, phoneNumber: '', code: '', processing: false, stage: IDKITStage.ENTER_PHONE })
	},
}))

export default useIDKitStore