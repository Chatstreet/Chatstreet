import store from '@/store';
import { UpdateUserDataRequestType } from '@/services/types/request.type';
import { IPlaybook, PlaybookNamesType } from '../playbook.type';

export default class UserDataUpdatePlaybook implements IPlaybook<string> {
  private readonly PLAYBOOK_NAME: PlaybookNamesType = 'USER_DATA_UPDATE';

  // eslint-disable-next-line class-methods-use-this
  public async start(data: UpdateUserDataRequestType): Promise<string> {
    return store
      .dispatch('user/postUpdateUserData', data)
      .then(() => store.getters['user/getUpdateUserDataRequest']?.error?.msg ?? null);
  }

  public notify(): void {
    console.log(`[Playbook] Start: ${this.PLAYBOOK_NAME}`);
  }

  public getPlaybookName(): PlaybookNamesType {
    return this.PLAYBOOK_NAME;
  }
}
