declare global {
    type Phase = 'influence' | 'sympathy' | 'sympathy-reasoning'
    type State = {
        phase: 'influence',
        progress: 'introduction'
        group: undefined
    } | {
        phase: Phase,
        progress: 'tutorial'
        group: undefined
    } | {
        phase: Phase,
        progress: 'ratings'
        group: number
    }
}

export {};