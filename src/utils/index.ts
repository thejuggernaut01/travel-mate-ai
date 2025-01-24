import { QueryProps } from '@/types';

export class BaseHelper {
  static async generateHash(input: QueryProps): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(input));
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
  }
}
