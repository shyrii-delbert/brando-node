// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.0
//   protoc               unknown
// source: user.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import {
  type CallOptions,
  ChannelCredentials,
  Client,
  type ClientOptions,
  type ClientUnaryCall,
  type handleUnaryCall,
  makeGenericClientConstructor,
  Metadata,
  type ServiceError,
  type UntypedServiceImplementation,
} from "@grpc/grpc-js";

export const protobufPackage = "sso.rs";

export interface User {
  id: number;
  username: string;
  faceUrl: string;
  nickname: string;
  selfInfo: string;
}

export interface GetUserIdByCookieRequest {
  cookie: string;
}

export interface GetUserIdByCookieResponse {
  userId: number;
}

export interface GetUserRequest {
  userId: string[];
}

export interface GetUserResponse {
  users: { [key: number]: User };
}

export interface GetUserResponse_UsersEntry {
  key: number;
  value: User | undefined;
}

function createBaseUser(): User {
  return { id: 0, username: "", faceUrl: "", nickname: "", selfInfo: "" };
}

export const User: MessageFns<User> = {
  encode(message: User, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.id !== 0) {
      writer.uint32(8).int32(message.id);
    }
    if (message.username !== "") {
      writer.uint32(18).string(message.username);
    }
    if (message.faceUrl !== "") {
      writer.uint32(26).string(message.faceUrl);
    }
    if (message.nickname !== "") {
      writer.uint32(34).string(message.nickname);
    }
    if (message.selfInfo !== "") {
      writer.uint32(42).string(message.selfInfo);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): User {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUser();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.id = reader.int32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.username = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.faceUrl = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.nickname = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.selfInfo = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): User {
    return {
      id: isSet(object.id) ? globalThis.Number(object.id) : 0,
      username: isSet(object.username) ? globalThis.String(object.username) : "",
      faceUrl: isSet(object.faceUrl) ? globalThis.String(object.faceUrl) : "",
      nickname: isSet(object.nickname) ? globalThis.String(object.nickname) : "",
      selfInfo: isSet(object.selfInfo) ? globalThis.String(object.selfInfo) : "",
    };
  },

  toJSON(message: User): unknown {
    const obj: any = {};
    if (message.id !== 0) {
      obj.id = Math.round(message.id);
    }
    if (message.username !== "") {
      obj.username = message.username;
    }
    if (message.faceUrl !== "") {
      obj.faceUrl = message.faceUrl;
    }
    if (message.nickname !== "") {
      obj.nickname = message.nickname;
    }
    if (message.selfInfo !== "") {
      obj.selfInfo = message.selfInfo;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<User>, I>>(base?: I): User {
    return User.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<User>, I>>(object: I): User {
    const message = createBaseUser();
    message.id = object.id ?? 0;
    message.username = object.username ?? "";
    message.faceUrl = object.faceUrl ?? "";
    message.nickname = object.nickname ?? "";
    message.selfInfo = object.selfInfo ?? "";
    return message;
  },
};

function createBaseGetUserIdByCookieRequest(): GetUserIdByCookieRequest {
  return { cookie: "" };
}

export const GetUserIdByCookieRequest: MessageFns<GetUserIdByCookieRequest> = {
  encode(message: GetUserIdByCookieRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.cookie !== "") {
      writer.uint32(10).string(message.cookie);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): GetUserIdByCookieRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserIdByCookieRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.cookie = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetUserIdByCookieRequest {
    return { cookie: isSet(object.cookie) ? globalThis.String(object.cookie) : "" };
  },

  toJSON(message: GetUserIdByCookieRequest): unknown {
    const obj: any = {};
    if (message.cookie !== "") {
      obj.cookie = message.cookie;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUserIdByCookieRequest>, I>>(base?: I): GetUserIdByCookieRequest {
    return GetUserIdByCookieRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetUserIdByCookieRequest>, I>>(object: I): GetUserIdByCookieRequest {
    const message = createBaseGetUserIdByCookieRequest();
    message.cookie = object.cookie ?? "";
    return message;
  },
};

function createBaseGetUserIdByCookieResponse(): GetUserIdByCookieResponse {
  return { userId: 0 };
}

export const GetUserIdByCookieResponse: MessageFns<GetUserIdByCookieResponse> = {
  encode(message: GetUserIdByCookieResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.userId !== 0) {
      writer.uint32(8).int32(message.userId);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): GetUserIdByCookieResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserIdByCookieResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.userId = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetUserIdByCookieResponse {
    return { userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0 };
  },

  toJSON(message: GetUserIdByCookieResponse): unknown {
    const obj: any = {};
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUserIdByCookieResponse>, I>>(base?: I): GetUserIdByCookieResponse {
    return GetUserIdByCookieResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetUserIdByCookieResponse>, I>>(object: I): GetUserIdByCookieResponse {
    const message = createBaseGetUserIdByCookieResponse();
    message.userId = object.userId ?? 0;
    return message;
  },
};

function createBaseGetUserRequest(): GetUserRequest {
  return { userId: [] };
}

export const GetUserRequest: MessageFns<GetUserRequest> = {
  encode(message: GetUserRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    for (const v of message.userId) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): GetUserRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.userId.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetUserRequest {
    return {
      userId: globalThis.Array.isArray(object?.userId) ? object.userId.map((e: any) => globalThis.String(e)) : [],
    };
  },

  toJSON(message: GetUserRequest): unknown {
    const obj: any = {};
    if (message.userId?.length) {
      obj.userId = message.userId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUserRequest>, I>>(base?: I): GetUserRequest {
    return GetUserRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetUserRequest>, I>>(object: I): GetUserRequest {
    const message = createBaseGetUserRequest();
    message.userId = object.userId?.map((e) => e) || [];
    return message;
  },
};

function createBaseGetUserResponse(): GetUserResponse {
  return { users: {} };
}

export const GetUserResponse: MessageFns<GetUserResponse> = {
  encode(message: GetUserResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    Object.entries(message.users).forEach(([key, value]) => {
      GetUserResponse_UsersEntry.encode({ key: key as any, value }, writer.uint32(10).fork()).join();
    });
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): GetUserResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          const entry1 = GetUserResponse_UsersEntry.decode(reader, reader.uint32());
          if (entry1.value !== undefined) {
            message.users[entry1.key] = entry1.value;
          }
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetUserResponse {
    return {
      users: isObject(object.users)
        ? Object.entries(object.users).reduce<{ [key: number]: User }>((acc, [key, value]) => {
          acc[globalThis.Number(key)] = User.fromJSON(value);
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: GetUserResponse): unknown {
    const obj: any = {};
    if (message.users) {
      const entries = Object.entries(message.users);
      if (entries.length > 0) {
        obj.users = {};
        entries.forEach(([k, v]) => {
          obj.users[k] = User.toJSON(v);
        });
      }
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUserResponse>, I>>(base?: I): GetUserResponse {
    return GetUserResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetUserResponse>, I>>(object: I): GetUserResponse {
    const message = createBaseGetUserResponse();
    message.users = Object.entries(object.users ?? {}).reduce<{ [key: number]: User }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[globalThis.Number(key)] = User.fromPartial(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseGetUserResponse_UsersEntry(): GetUserResponse_UsersEntry {
  return { key: 0, value: undefined };
}

export const GetUserResponse_UsersEntry: MessageFns<GetUserResponse_UsersEntry> = {
  encode(message: GetUserResponse_UsersEntry, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.key !== 0) {
      writer.uint32(8).int32(message.key);
    }
    if (message.value !== undefined) {
      User.encode(message.value, writer.uint32(18).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): GetUserResponse_UsersEntry {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserResponse_UsersEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.key = reader.int32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.value = User.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetUserResponse_UsersEntry {
    return {
      key: isSet(object.key) ? globalThis.Number(object.key) : 0,
      value: isSet(object.value) ? User.fromJSON(object.value) : undefined,
    };
  },

  toJSON(message: GetUserResponse_UsersEntry): unknown {
    const obj: any = {};
    if (message.key !== 0) {
      obj.key = Math.round(message.key);
    }
    if (message.value !== undefined) {
      obj.value = User.toJSON(message.value);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUserResponse_UsersEntry>, I>>(base?: I): GetUserResponse_UsersEntry {
    return GetUserResponse_UsersEntry.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetUserResponse_UsersEntry>, I>>(object: I): GetUserResponse_UsersEntry {
    const message = createBaseGetUserResponse_UsersEntry();
    message.key = object.key ?? 0;
    message.value = (object.value !== undefined && object.value !== null) ? User.fromPartial(object.value) : undefined;
    return message;
  },
};

export type UserServiceService = typeof UserServiceService;
export const UserServiceService = {
  getUserIdByCookie: {
    path: "/sso.rs.UserService/GetUserIdByCookie",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetUserIdByCookieRequest) => Buffer.from(GetUserIdByCookieRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetUserIdByCookieRequest.decode(value),
    responseSerialize: (value: GetUserIdByCookieResponse) =>
      Buffer.from(GetUserIdByCookieResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetUserIdByCookieResponse.decode(value),
  },
  getUser: {
    path: "/sso.rs.UserService/GetUser",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetUserRequest) => Buffer.from(GetUserRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetUserRequest.decode(value),
    responseSerialize: (value: GetUserResponse) => Buffer.from(GetUserResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetUserResponse.decode(value),
  },
} as const;

export interface UserServiceServer extends UntypedServiceImplementation {
  getUserIdByCookie: handleUnaryCall<GetUserIdByCookieRequest, GetUserIdByCookieResponse>;
  getUser: handleUnaryCall<GetUserRequest, GetUserResponse>;
}

export interface UserServiceClient extends Client {
  getUserIdByCookie(
    request: GetUserIdByCookieRequest,
    callback: (error: ServiceError | null, response: GetUserIdByCookieResponse) => void,
  ): ClientUnaryCall;
  getUserIdByCookie(
    request: GetUserIdByCookieRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetUserIdByCookieResponse) => void,
  ): ClientUnaryCall;
  getUserIdByCookie(
    request: GetUserIdByCookieRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetUserIdByCookieResponse) => void,
  ): ClientUnaryCall;
  getUser(
    request: GetUserRequest,
    callback: (error: ServiceError | null, response: GetUserResponse) => void,
  ): ClientUnaryCall;
  getUser(
    request: GetUserRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetUserResponse) => void,
  ): ClientUnaryCall;
  getUser(
    request: GetUserRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetUserResponse) => void,
  ): ClientUnaryCall;
}

export const UserServiceClient = makeGenericClientConstructor(UserServiceService, "sso.rs.UserService") as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): UserServiceClient;
  service: typeof UserServiceService;
  serviceName: string;
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
