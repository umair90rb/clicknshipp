export const utilPathSelector = (state) => state.util.path;
export const utilMessageSelector = (state) => ({ message: state.util.message, type: state.util.type });
export const utilRefreshSelector = (state) => state.util.refresh;
