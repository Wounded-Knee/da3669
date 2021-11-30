export const defaultState = {
  checkbox: false,
  text: '',
  title: '',
  kind: 'Document',
};

export const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'UPDATED_TEXT':
      return {
        ...state,
        saved: false,
        node: {
          ...state.node,
          text: payload,
        },
      };

    case 'UPDATED_CHECKBOX':
      return {
        ...state,
        saved: false,
        node: {
          ...state.node,
          checkbox: !state.node.checkbox,
        },
      };

    case 'UPDATED_TITLE':
      return {
        ...state,
        saved: false,
        node: {
          ...state.node,
          title: payload,
        },
      };

    default:
      return state;
  }
};
