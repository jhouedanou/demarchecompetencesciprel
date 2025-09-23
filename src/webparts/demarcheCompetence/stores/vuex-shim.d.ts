// Vuex type declarations
declare module 'vuex' {
  export interface Module<S, R> {
    namespaced?: boolean;
    state?: S | (() => S);
    getters?: any;
    actions?: any;
    mutations?: any;
    modules?: any;
  }

  export class Store<S> {
    constructor(options: any);
    state: S;
    getters: any;
    dispatch: any;
    commit: any;
  }

  export function mapState(...args: any[]): any;
  export function mapGetters(...args: any[]): any;
  export function mapActions(...args: any[]): any;
  export function mapMutations(...args: any[]): any;
}
