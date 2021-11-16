class Class {
  log(...args): void {
    // @ts-ignore
    const showColors = typeof window !== 'undefined';
    const fgCyan = showColors ? '' : '\x1b[36m';
    const reset = showColors ? '' : '\x1b[0m';
    const { _showDebug: visible, _className: className } = Object.getPrototypeOf(this);
    if (visible) {
      console.log.apply(console, [`${fgCyan}D³${className}${reset}:`, ...args]);
    }
  }
}
Object.assign(Class.prototype, {
  _className: 'Class',
  _showDebug: true,
});

export default Class;
