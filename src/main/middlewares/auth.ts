import { makeAuthMiddleware } from '@/main/factories';
import { adaptMiddleware } from '@/main/adapters';

export const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'));
export const auth = adaptMiddleware(makeAuthMiddleware());
