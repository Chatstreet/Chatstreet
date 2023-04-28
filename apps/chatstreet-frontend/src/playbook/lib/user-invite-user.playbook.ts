import store from '@/store';
import { InviteUserRequestType } from '@/services/types/request.type';
import { IPlaybook, PlaybookNamesType } from '../playbook.type';

export default class UserInviteUserPlaybook implements IPlaybook<string> {
  private readonly PLAYBOOK_NAME: PlaybookNamesType = 'USER_INVITE_USER';

  // eslint-disable-next-line class-methods-use-this
  public async start(data: InviteUserRequestType): Promise<string> {
    return store
      .dispatch('user/postUserInvite', data)
      .then(() => store.getters['user/getUserInviteRequest']?.error?.msg ?? null);
  }

  public notify(): void {
    console.log(`[Playbook] Start: ${this.PLAYBOOK_NAME}`);
  }

  public getPlaybookName(): PlaybookNamesType {
    return this.PLAYBOOK_NAME;
  }
}
