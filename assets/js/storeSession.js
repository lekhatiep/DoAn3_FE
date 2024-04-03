export function setSession(key, value) {
    sessionStorage.setItem(key,value);
}

export function getSession(key) {
    let value = sessionStorage.getItem(key);

    return value;
}

export function removeSession(key) {
    sessionStorage.removeItem(key);
}

export function removeAllSession() {
    sessionStorage.clear();
}