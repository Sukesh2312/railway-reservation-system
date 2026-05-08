let ioInstance = null;

export function setIO(io) {
  ioInstance = io;
}

export function getIO() {
  return ioInstance;
}

export function emitEvent(event, payload) {
  if (ioInstance) ioInstance.emit(event, payload);
}
