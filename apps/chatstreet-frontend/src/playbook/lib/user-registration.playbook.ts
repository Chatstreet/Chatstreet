import store from '@/store';
import { RegisterUserRequestType } from '@/services/types/request.type';
import { IPlaybook, PlaybookNamesType } from '../playbook.type';

export default class UserRegistrationPlaybook implements IPlaybook<string> {
  private readonly PLAYBOOK_NAME: PlaybookNamesType = 'USER_REGISTRATION';

  // eslint-disable-next-line class-methods-use-this
  public async start(data: RegisterUserRequestType): Promise<string> {
    return store
      .dispatch('account/postRegisterUser', data)
      .then(() => store.getters['account/getRegisterUserRequest']?.error?.msg ?? null);
  }

  public notify(): void {
    console.log(`[Playbook] Start: ${this.PLAYBOOK_NAME}`);
  }

  public getPlaybookName(): PlaybookNamesType {
    return this.PLAYBOOK_NAME;
  }
}
