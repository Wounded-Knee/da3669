class Class {
  error(...args): void {
    const { _showDebug: visible, _className: className } = Object.getPrototypeOf(this);
    if (visible) {
      const node = typeof process === 'object';
      const d3 = 'D³';
      const moduleName = `${d3}${className}`;
      if (node) {
        const fgCyan = '\x1b[36m';
        const reset = '\x1b[0m';
        console.log.apply(console, [`${fgCyan}${moduleName}${reset}:`, ...args]);
      } else {
        const { text, styles } = moduleName.split('').reduce(
          ({ text, styles }, character, i, { length }) => ({
            text: `${text}%c${character}`,
            styles: [...styles, 'color: hsl(' + (360 * i) / length + ',80%,50%)'],
          }),
          { text: '', styles: [] },
        );

        console.error.apply(console, [text, ...styles, ...args]);
      }
    }
  }

  log(...args): void {
    const { _showDebug: visible, _className: className } = Object.getPrototypeOf(this);
    if (visible) {
      const node = typeof process === 'object';
      const d3 = 'D³';
      const moduleName = `${d3}${className}`;
      if (node) {
        const fgCyan = '\x1b[36m';
        const reset = '\x1b[0m';
        console.log.apply(console, [`${fgCyan}${moduleName}${reset}:`, ...args]);
      } else {
        const { text, styles } = moduleName.split('').reduce(
          ({ text, styles }, character, i, { length }) => ({
            text: `${text}%c${character}`,
            styles: [...styles, 'color: hsl(' + (360 * i) / length + ',80%,50%)'],
          }),
          { text: '', styles: [] },
        );

        console.log.apply(console, [text, ...styles, ...args]);
      }
    }
  }
}

Object.assign(Class.prototype, {
  _className: 'Class',
  _showDebug: true,
});

export default Class;
