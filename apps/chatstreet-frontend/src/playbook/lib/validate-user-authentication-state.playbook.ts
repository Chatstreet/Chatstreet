import store from '@/store';
import { IPlaybook, PlaybookNamesType } from '../playbook.type';

export default class ValidateUserAuthenticationStatePlaybook implements IPlaybook<boolean> {
  private readonly PLAYBOOK_NAME: PlaybookNamesType = 'VALIDATE_USER_AUTHENTICATION_STATE';

  // eslint-disable-next-line class-methods-use-this
  public async start(): Promise<boolean> {
    return store
      .dispatch('account/postRefresh')
      .then(() => store.getters['account/getRefreshRequest']?.status === 'SUCCESS' ?? false);
  }

  public notify(): void {
    console.log(`[Playbook] Start: ${this.PLAYBOOK_NAME}`);
  }

  public getPlaybookName(): PlaybookNamesType {
    return this.PLAYBOOK_NAME;
  }
}
