import { ResponseTypesEnums } from '@/services/response.type';

function typeOrNull<T extends ResponseTypesEnums>(value: any, typeName: string): T | null {
  if (value.name === typeName) {
    const result: T = value;
    return result;
  }
  return null;
}

export default typeOrNull;
