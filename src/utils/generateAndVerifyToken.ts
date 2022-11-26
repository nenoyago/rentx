import { sign, verify } from 'jsonwebtoken';

import auth from '@config/auth';

interface IPayload {
  sub: string;
  email?: string;
}

const {
  secret_token,
  expires_in_token,
  secret_refresh_token,
  expires_in_refresh_token,
} = auth;

export function generateJwtToken(user_id: string, payload: Object = {}) {
  const token = sign(payload, secret_token, {
    subject: user_id,
    expiresIn: expires_in_token,
  });

  return token;
}

export function generateJwtRefreshToken(user_id: string, payload: Object = {}) {
  const refresh_token = sign(payload, secret_refresh_token, {
    subject: user_id,
    expiresIn: expires_in_refresh_token,
  });

  return refresh_token;
}

export function verifyToken(
  token: string,
  tokenType: 'token' | 'refresh_token'
): IPayload {
  let secret = secret_token;

  if (tokenType === 'refresh_token') {
    secret = secret_refresh_token;
  }

  const decode = verify(token, secret) as IPayload;

  return decode;
}
