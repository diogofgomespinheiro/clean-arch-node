import { AccountModel } from '@/domain/models';
import { AddAccountParams } from '@/domain/useCases';

export interface AddAccountRepository {
  add(data: AddAccountParams): Promise<AccountModel>;
}
