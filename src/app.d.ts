declare global {
    type Phase = 'influence' | 'sympathy' | 'sympathy-reasoning'
    namespace App {
        interface PageState {
            student?: number
            phase?: Phase,
        }
    }
}

export {};