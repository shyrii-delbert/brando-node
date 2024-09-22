import {
  GetUserRequest,
  GetUserResponse,
  UserServiceClient,
} from '../rpc-gen/user';
import grpc from '@grpc/grpc-js';
import {
  GetUserIdByCookieResponse,
  GetUserIdByCookieRequest,
} from 'src/rpc-gen/user';
import { promisify } from 'util';

export const ssoRpcClient = new UserServiceClient(
  process.env.SSO_GRPC,
  grpc.credentials.createInsecure()
);

export const promisedGetUserIdByCookie = promisify<
  GetUserIdByCookieRequest,
  GetUserIdByCookieResponse
>(ssoRpcClient.getUserIdByCookie.bind(ssoRpcClient));

export const promisedGetUserByIds = promisify<GetUserRequest, GetUserResponse>(
  ssoRpcClient.getUser.bind(ssoRpcClient)
);
