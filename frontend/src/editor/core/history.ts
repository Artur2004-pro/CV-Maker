export function createHistory<T>(initial: T) {
  let past: T[] = [];
  let present = initial;
  let future: T[] = [];

  return {
    get: () => present,
    push(next: T) {
      past.push(present);
      present = next;
      future = [];
    },
    undo() {
      if (!past.length) return present;
      future.unshift(present);
      present = past.pop()!;
      return present;
    },
    redo() {
      if (!future.length) return present;
      past.push(present);
      present = future.shift()!;
      return present;
    },
  };
}
