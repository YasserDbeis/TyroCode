export default class UndoStack {
  constructor() {
    this.history = new Stack();
    this.future = new Stack();
  }

  push(newState) {
    this.future = new Stack();
    this.history.push(newState);
  }

  getCurrentFrame() {
    return this.history.empty() ? null : this.history.peek();
  }

  popHistory() {
    return this.history.empty() ? null : this.history.pop();
  }

  popFuture() {
    return this.future.empty() ? null : this.future.pop();
  }

  undo() {
    const history = this.popHistory();

    if (history != null) {
      this.future.push(history);
      return history;
    }
    console.log(this);

    return null;
  }

  redo() {
    const future = this.popFuture();

    if (future != null) {
      this.history.push(future);
      return future;
    }
    console.log(this);

    return null;
  }
}

class Stack extends Array {
  peek() {
    const arrLen = this.length;
    return this[arrLen - 1];
  }

  empty() {
    return this.length == 0;
  }

  //   clear() {
  //     this.clear();
  //   }
}
