import { createStore } from 'vuex';
import AccountStoreModule, { AccountState } from './modules/account.module';
import UserStoreModule, { UserState } from './modules/user.module';

export interface State extends AccountState, UserState {
  app: string;
}

export default createStore<State>({
  modules: {
    account: AccountStoreModule,
    user: UserStoreModule,
  },
});
