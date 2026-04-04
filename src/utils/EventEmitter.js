const events = new Map();

export function on(eventName, callback) {
  if (!events.has(eventName)) {
    events.set(eventName, []);
  }
  events.get(eventName).push(callback);
}

export function off(eventName, callback) {
  if (!events.has(eventName)) return;

  const listeners = events.get(eventName);
  const index = listeners.indexOf(callback);

  if (index !== -1) {
    listeners.splice(index, 1);
  }

  if (listeners.length === 0) {
    events.delete(eventName);
  }
}

export function emit(eventName, data) {
  if (!events.has(eventName)) return;

  const listeners = events.get(eventName).slice();
  listeners.forEach((callback) => {
    try {
      callback(data);
    } catch (_error) {
      // silently ignore listener errors
    }
  });
}

export function removeAllListeners(eventName) {
  if (eventName) {
    events.delete(eventName);
  } else {
    events.clear();
  }
}
