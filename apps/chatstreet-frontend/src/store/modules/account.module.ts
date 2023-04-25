import { StoreRequestResultType, CommitFunction } from '@/store/types/store.type';
import { Module } from 'vuex';
import {
  RegisterUserResponeType,
  ErrorResponseType,
  VerifyEmailResponseType,
  LoginResponseType,
  RefreshResponseType,
  LogoutResponseType,
  ResetPasswordResponseType,
  ChangePasswordResponseType,
  RequestResponseType,
} from '@/services/types/response.type';
import {
  registerUser,
  verifyEmail,
  login,
  refresh,
  logout,
  resetPassword,
  changePassword,
} from '@/services/request.service';
import {
  RegisterUserRequestType,
  VerifyEmailRequestType,
  LoginRequestType,
  ResetPasswordRequestType,
  ChangePasswordRequestType,
} from '@/services/types/request.type';

export interface AccountState {
  registerUserRequest?: StoreRequestResultType;
  verifyEmailRequest?: StoreRequestResultType;
  loginRequest?: StoreRequestResultType;
  refreshRequest?: StoreRequestResultType;
  logoutRequest?: StoreRequestResultType;
  resetPasswordRequest?: StoreRequestResultType;
  changePasswordRequest?: StoreRequestResultType;
}

const AccountStoreModule: Module<AccountState, any> = {
  namespaced: true,
  // state: (): AccountState => ({}),
  getters: {
    getRegisterUserRequest: (state: AccountState) => state.registerUserRequest ?? {},
    getVerifyEmailRequest: (state: AccountState) => state.verifyEmailRequest ?? {},
    getLoginRequest: (state: AccountState) => state.loginRequest ?? {},
    getRefreshRequest: (state: AccountState) => state.refreshRequest ?? {},
    getLogoutRequest: (state: AccountState) => state.logoutRequest ?? {},
    getResetPasswordRequest: (state: AccountState) => state.resetPasswordRequest ?? {},
    getChangePasswordRequest: (state: AccountState) => state.changePasswordRequest ?? {},
  },
  mutations: {
    REGISTER_USER_REQUEST_START(state: AccountState) {
      state.registerUserRequest = {
        status: 'PENDING',
      };
    },
    REGISTER_USER_REQUEST_SUCCESS(state: AccountState, result: RegisterUserResponeType) {
      state.registerUserRequest = {
        status: 'SUCCESS',
        result,
      };
    },
    REGISTER_USER_REQUEST_ERROR(state: AccountState, error: ErrorResponseType) {
      state.registerUserRequest = {
        status: 'ERROR',
        error,
      };
    },
    VERIFY_EMAIL_REQUEST_START(state: AccountState) {
      state.verifyEmailRequest = {
        status: 'PENDING',
      };
    },
    VERIFY_EMAIL_REQUEST_SUCCESS(state: AccountState, result: VerifyEmailResponseType) {
      state.verifyEmailRequest = {
        status: 'SUCCESS',
        result,
      };
    },
    VERIFY_EMAIL_REQUEST_ERROR(state: AccountState, error: ErrorResponseType) {
      state.verifyEmailRequest = {
        status: 'ERROR',
        error,
      };
    },
    LOGIN_REQUEST_START(state: AccountState) {
      state.loginRequest = {
        status: 'PENDING',
      };
    },
    LOGIN_REQUEST_SUCCESS(state: AccountState, result: LoginResponseType) {
      state.loginRequest = {
        status: 'SUCCESS',
        result,
      };
    },
    LOGIN_REQUEST_ERROR(state: AccountState, error: ErrorResponseType) {
      state.loginRequest = {
        status: 'ERROR',
        error,
      };
    },
    REFRESH_REQUEST_START(state: AccountState) {
      state.refreshRequest = {
        status: 'PENDING',
      };
    },
    REFRESH_REQUEST_SUCCESS(state: AccountState, result: RefreshResponseType) {
      state.refreshRequest = {
        status: 'SUCCESS',
        result,
      };
    },
    REFRESH_REQUEST_ERROR(state: AccountState, error: ErrorResponseType) {
      state.refreshRequest = {
        status: 'ERROR',
        error,
      };
    },
    LOGOUT_REQUEST_START(state: AccountState) {
      state.logoutRequest = {
        status: 'PENDING',
      };
    },
    LOGOUT_REQUEST_SUCCESS(state: AccountState, result: LogoutResponseType) {
      state.logoutRequest = {
        status: 'SUCCESS',
        result,
      };
    },
    LOGOUT_REQUEST_ERROR(state: AccountState, error: ErrorResponseType) {
      state.logoutRequest = {
        status: 'ERROR',
        error,
      };
    },
    RESET_PASSWORD_REQUEST_START(state: AccountState) {
      state.resetPasswordRequest = {
        status: 'PENDING',
      };
    },
    RESET_PASSWORD_REQUEST_SUCCESS(state: AccountState, result: ResetPasswordResponseType) {
      state.resetPasswordRequest = {
        status: 'SUCCESS',
        result,
      };
    },
    RESET_PASSWORD_REQUEST_ERROR(state: AccountState, error: ErrorResponseType) {
      state.resetPasswordRequest = {
        status: 'ERROR',
        error,
      };
    },
    CHANGE_PASSWORD_REQUEST_START(state: AccountState) {
      state.changePasswordRequest = {
        status: 'PENDING',
      };
    },
    CHANGE_PASSWORD_REQUEST_SUCCESS(state: AccountState, result: ChangePasswordResponseType) {
      state.changePasswordRequest = {
        status: 'SUCCESS',
        result,
      };
    },
    CHANGE_PASSWORD_REQUEST_ERROR(state: AccountState, error: ErrorResponseType) {
      state.changePasswordRequest = {
        status: 'ERROR',
        error,
      };
    },
  },
  actions: {
    postRegisterUser({ commit }: CommitFunction, input: RegisterUserRequestType) {
      commit('REGISTER_USER_REQUEST_START');
      registerUser(input.firstName, input.lastName, input.username, input.password, input.email)
        .then((response: RegisterUserResponeType) => commit('REGISTER_USER_REQUEST_SUCCESS', response))
        .catch((error) => {
          commit('REGISTER_USER_REQUEST_ERROR', {
            code: error.toJSON().status,
            msg: error.toJSON().message,
          });
        });
    },
    async postVerifyEmail({ commit }: CommitFunction, input: VerifyEmailRequestType) {
      commit('VERIFY_EMAIL_REQUEST_START');
      await verifyEmail(input.code)
        .then((response: RequestResponseType<VerifyEmailResponseType>) => {
          if (response[1] !== 200) {
            commit('VERIFY_EMAIL_REQUEST_ERROR', {
              code: response[1],
              msg: response[0].msg,
            });
          } else {
            commit('VERIFY_EMAIL_REQUEST_SUCCESS', response);
          }
        })
        .catch((error) => {
          commit('VERIFY_EMAIL_REQUEST_ERROR', {
            code: error.toJSON().status,
            msg: error.toJSON().message,
          });
        });
    },
    async postLogin({ commit }: CommitFunction, input: LoginRequestType) {
      commit('LOGIN_REQUEST_START');
      await login(input.username, input.userTag, input.password)
        .then((response: RequestResponseType<LoginResponseType>) => {
          if (response[1] !== 200) {
            commit('LOGIN_REQUEST_ERROR', {
              code: response[1],
              msg: response[0].msg,
            });
          } else {
            commit('LOGIN_REQUEST_SUCCESS', response);
          }
        })
        .catch((error) => {
          commit('LOGIN_REQUEST_ERROR', {
            code: error.toJSON().status,
            msg: error.toJSON().message,
          });
        });
    },
    async postRefresh({ commit }: CommitFunction) {
      commit('REFRESH_REQUEST_START');
      await refresh()
        .then((response: RefreshResponseType) => commit('REFRESH_REQUEST_SUCCESS', response))
        .catch((error) => {
          commit('REFRESH_REQUEST_ERROR', {
            code: error.toJSON().status,
            msg: error.toJSON().message,
          });
        });
    },
    postLogout({ commit }: CommitFunction) {
      commit('LOGOUT_REQUEST_START');
      logout()
        .then((response: LogoutResponseType) => commit('LOGOUT_REQUEST_SUCCESS', response))
        .catch((error) => {
          commit('LOGOUT_REQUEST_ERROR', {
            code: error.toJSON().status,
            msg: error.toJSON().message,
          });
        });
    },
    postResetPassword({ commit }: CommitFunction, input: ResetPasswordRequestType) {
      commit('RESET_PASSWORD_REQUEST_START');
      resetPassword(input.username, input.userTag)
        .then((response: ResetPasswordResponseType) => commit('RESET_PASSWORD_REQUEST_SUCCESS', response))
        .catch((error) => {
          commit('RESET_PASSWORD_REQUEST_ERROR', {
            code: error.toJSON().status,
            msg: error.toJSON().message,
          });
        });
    },
    postChangePassword({ commit }: CommitFunction, input: ChangePasswordRequestType) {
      commit('CHANGE_PASSWORD_REQUEST_START');
      changePassword(input.code, input.password)
        .then((response: ChangePasswordResponseType) => commit('CHANGE_PASSWORD_REQUEST_SUCCESS', response))
        .catch((error) => {
          commit('CHANGE_PASSWORD_REQUEST_ERROR', {
            code: error.toJSON().status,
            msg: error.toJSON().message,
          });
        });
    },
  },
};

export default AccountStoreModule;
