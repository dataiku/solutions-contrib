const EXECUTING_TIME_WINDOW = 45;
const MIN_TIMEOUT = 250;

let _timeoutExecuteOnce: Function = () => {
    undefined;
};
{
    const lastCalledContext = new Map();
    const timeoutContext = new Map();

    function timeoutOnce(
        callback: Function,
        timeout: number,
        callbackId?: any,
        ...args: any[]
    ) {
        if (callbackId === undefined) {
            callbackId = callback;
        }
        lastCalledContext.set(callbackId, Date.now());
        timeoutContext.set(callbackId, timeout);
        setTimeout(() => {
            if (!lastCalledContext.has(callbackId)) {
                return;
            }
            const timeout: number = timeoutContext.get(callbackId);
            const lastCalled: number = lastCalledContext.get(callbackId);

            if (
                timeout < MIN_TIMEOUT ||
                Date.now() - lastCalled > timeout - EXECUTING_TIME_WINDOW
            ) {
                if (args) {
                    callback(...args);
                } else {
                    callback();
                }
                lastCalledContext.delete(callbackId);
            }
        }, timeout);
    }
    _timeoutExecuteOnce = timeoutOnce;
}

export function timeoutExecuteOnce(
    callback: Function,
    timeout: number,
    callbackId?: any,
    ...args: any[]
) {
    if (args) {
        return _timeoutExecuteOnce(callback, timeout, callbackId, ...args);
    }
    return _timeoutExecuteOnce(callback, timeout, callbackId);
}