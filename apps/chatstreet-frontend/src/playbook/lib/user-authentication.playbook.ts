import store from '@/store';
import { LoginRequestType } from '@/services/types/request.type';
import { IPlaybook, PlaybookNamesType } from '../playbook.type';

export default class UserAuthenticationPlaybook implements IPlaybook<string> {
  private readonly PLAYBOOK_NAME: PlaybookNamesType = 'USER_AUTHENTICATION';

  // eslint-disable-next-line class-methods-use-this
  public async start(data: LoginRequestType): Promise<string> {
    return store
      .dispatch('account/postLogin', data)
      .then(() => store.getters['account/getLoginRequest']?.error?.msg ?? null);
  }

  public notify(): void {
    console.log(`[Playbook] Start: ${this.PLAYBOOK_NAME}`);
  }

  public getPlaybookName(): PlaybookNamesType {
    return this.PLAYBOOK_NAME;
  }
}
