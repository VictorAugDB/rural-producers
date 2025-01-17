import { cnpj, cpf } from 'cpf-cnpj-validator';

export function isValidCpfCnpj(value: string): boolean {
  return cpf.isValid(value) || cnpj.isValid(value);
}
