"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = exports.store = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const slice = toolkit_1.createSlice({
    name: 'slice',
    initialState: {
        entityId: 0,
        entities: [],
    },
    reducers: {
        receiveEntity: (state, { payload }) => {
            state.entities = [...state.entities.filter((entity) => entity.id !== payload.id), payload];
        },
    },
});
exports.store = toolkit_1.configureStore({
    reducer: slice.reducer,
});
exports.actions = Object.keys(slice.actions).reduce((actions, actionName) => {
    const action = slice.actions[actionName];
    return { ...actions, [actionName]: (...args) => exports.store.dispatch(action(...args)) };
}, {});
//# sourceMappingURL=ReduxStore.js.map