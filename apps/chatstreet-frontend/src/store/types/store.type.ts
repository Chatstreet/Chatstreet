import { ResponseTypesEnums, ErrorResponseType } from '@/services/types/response.type';
import { Commit } from 'vuex';

type StoreRequestResultType = {
  status: 'PENDING' | 'SUCCESS' | 'ERROR';
  result?: ResponseTypesEnums;
  error?: ErrorResponseType;
};

interface CommitFunction {
  commit: Commit;
}

export { StoreRequestResultType, CommitFunction };
