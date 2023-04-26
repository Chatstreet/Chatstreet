import store from '@/store';
import { ResetPasswordRequestType } from '@/services/types/request.type';
import { IPlaybook, PlaybookNamesType } from '../playbook.type';

export default class AccountResetPasswordPlaybook implements IPlaybook<string> {
  private readonly PLAYBOOK_NAME: PlaybookNamesType = 'ACCOUNT_RESET_PASSWORD';

  // eslint-disable-next-line class-methods-use-this
  public async start(data: ResetPasswordRequestType): Promise<string> {
    return store
      .dispatch('account/postResetPassword', data)
      .then(() => store.getters['account/getResetPasswordRequest']?.error?.msg ?? null);
  }

  public notify(): void {
    console.log(`[Playbook] Start: ${this.PLAYBOOK_NAME}`);
  }

  public getPlaybookName(): PlaybookNamesType {
    return this.PLAYBOOK_NAME;
  }
}
