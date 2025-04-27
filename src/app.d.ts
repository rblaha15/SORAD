declare global {
    namespace App {
        interface PageState {
            student?: number
            phase?: 'influence' | 'sympathy' | 'sympathy-reasoning',
        }
    }
}

export {};