import { ResponseTypesEnums, ResponseErrorType } from '@/services/response.type';
import { Commit } from 'vuex';

type StoreRequestResultType = {
  status: 'PENDING' | 'SUCCESS' | 'ERROR';
  result?: ResponseTypesEnums;
  error?: ResponseErrorType;
};

interface CommitFunction {
  commit: Commit;
}

export { StoreRequestResultType, CommitFunction };
