import store from '@/store';
import { InviteResponseRequestType } from '@/services/types/request.type';
import { IPlaybook, PlaybookNamesType } from '../playbook.type';

export default class UserInvitationResponsePlaybook implements IPlaybook<string> {
  private readonly PLAYBOOK_NAME: PlaybookNamesType = 'USER_INVITATION_RESPONSE';

  // eslint-disable-next-line class-methods-use-this
  public async start(data: InviteResponseRequestType): Promise<string> {
    return store
      .dispatch('user/postInviteResponse', data)
      .then(() => store.getters['user/getInviteResponseRequest']?.error?.msg ?? null);
  }

  public notify(): void {
    console.log(`[Playbook] Start: ${this.PLAYBOOK_NAME}`);
  }

  public getPlaybookName(): PlaybookNamesType {
    return this.PLAYBOOK_NAME;
  }
}
