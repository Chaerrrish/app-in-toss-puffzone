
type AuthEventType = 'sessionExpired';

type Listener = () => void;

class AuthEventEmitter {
    private listeners: Record<AuthEventType, Listener[]> = {
        sessionExpired: [],
    };

    on(event: AuthEventType, listener: Listener) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(listener);
        return () => this.off(event, listener);
    }

    off(event: AuthEventType, listener: Listener) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(l => l !== listener);
    }

    emit(event: AuthEventType) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(listener => listener());
    }
}

export const authEvents = new AuthEventEmitter();
