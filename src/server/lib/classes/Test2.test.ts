const nodex = (text, child = undefined) => ({
  setup: () => {
    if (child) child.setup();
    console.log(text, 'Setup');
    // Do stuff at setup
  },

  render: () => {
    // Do stuff at render
    return 'Render';
  },
});

nodex('Hello').setup();
