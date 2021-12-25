const noChange = (state, action) => {
  if (typeof action === 'string') {
    return { ...state, text: [action, ...(state.text || [])] };
  } else if (typeof action === 'object') {
    if (action instanceof Array) {
    } else if (action instanceof Object) {
    } else {
      console.log('Truly mystified');
    }
  } else if (typeof action === 'function') {
    return action(state);
  }
};

const acceptText = (state, { type, payload }) => {
  switch (type) {
    case 'TEXT':
      return { ...state, text: [payload, ...(state.text || [])] };
  }
  return state;
};

const node = (data, reducer = noChange, options = []) => ({
  data,
  options,
  reducer,
});

const data = {
  state: {
    data: '',
    'user.thing': true,
  },

  root: [
    node('You provide data.', undefined, [
      node('Data is staged. Visible only to you.', undefined, [
        node('Data is self-moderated. Tagged by you or opportunity to tag given to you.', undefined, [
          node('Data is activated. Visible to moderators.', undefined, [
            node(
              {
                type: 'TEXT',
                payload: 'Data is pre-moderated. Tagged by moderators or opportunity to tag given to moderators.',
              },
              acceptText,
              [
                node(
                  (state) => ({ ...state, morph: true, text: ['Data is unfurled. Visible to public.', ...state.text] }),
                  undefined,
                  [
                    node('Data is post-moderated.', undefined, [
                      node('Data is confirmed. Visible to the discerning public.'),
                    ]),
                  ],
                ),
              ],
            ),
          ]),
        ]),
        node('Give up waiting, and trash the data.'),
      ]),
    ]),
  ],
};

console.log(Date.now());

const run = (
  node = data.root[0],
  nav = [
    [0, 1640346244373],
    [0, 1640346497194],
    [0, 1640348987622],
    [0, 1640349011175],
    [0, 1640349061247],
    [0, 1640349069556],
    [0, 1640349079919],
  ],
  state = data.state,
) => {
  const next = nav.length > 0 ? run(node.options[nav[0][0]], nav.splice(1)) : {};
  return node.reducer(next, node.data);
};

const navGen = () => [{ a: 0, b: 1640346244373 }];

console.log(run());
