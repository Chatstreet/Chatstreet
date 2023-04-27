import UserAuthenticationPlaybook from './lib/user-authentication.playbook';
import ValidateUserAuthenticationStatePlaybook from './lib/validate-user-authentication-state.playbook';
import AccountResetPasswordPlaybook from './lib/account-reset-password.playbook';
import { IPlaybook, PlaybookNamesType, PlaybookReturnType } from './playbook.type';
import UserRegistrationPlaybook from './lib/user-registration.playbook';

export default class Playbook {
  private static readonly playbooks: IPlaybook<any>[] = [
    new ValidateUserAuthenticationStatePlaybook(),
    new UserAuthenticationPlaybook(),
    new AccountResetPasswordPlaybook(),
    new UserRegistrationPlaybook(),
  ];

  public static async play<T extends PlaybookNamesType>(
    playbookName: T,
    data: any = null,
  ): Promise<PlaybookReturnType<T> | null> {
    const playbook: IPlaybook<any> | null = this.playbooks.find((pb: IPlaybook<any>) => pb.getPlaybookName() === playbookName) ?? null;
    if (!playbook) return null;
    if (process.env.NODE_ENV === 'development') {
      playbook.notify();
    }
    return playbook.start(data);
  }
}
