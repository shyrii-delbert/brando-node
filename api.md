# Brando API 文档

## 概述

Brando 是一个照片管理系统的后端 API 服务，提供用户管理、图片上传、相册管理等功能。

## 基础信息

- **Base URL**: `/api/v1`
- **认证方式**: Cookie 认证（部分接口需要）
- **响应格式**: JSON
- **统一响应结构**:
  ```json
  {
    "code": 200,
    "data": {...}
  }
  ```

## 接口列表

### 1. 根路由

#### GET /

- **描述**: 欢迎信息
- **认证**: 不需要
- **响应**:
  ```text
  Hello brando!
  ```

### 2. 用户相关接口

#### GET /api/v1/user

- **描述**: 获取当前登录用户信息
- **认证**: 需要（Cookie）
- **响应示例**:
  ```json
  {
    "code": 200,
    "data": {
      "user": {
        "id": 123,
        "username": "example_user",
        "faceUrl": "https://example.com/avatar.jpg",
        "nickname": "示例用户",
        "selfInfo": "个人简介"
      }
    }
  }
  ```

### 3. 图片相关接口

#### POST /api/v1/images

- **描述**: 上传图片
- **认证**: 需要（Cookie）
- **Content-Type**: multipart/form-data
- **参数**:
  - `image`: 图片文件（支持 JPG/JPEG/PNG 等格式）
- **响应示例**:
  ```json
  {
    "code": 200,
    "data": {
      "imageId": "550e8400-e29b-41d4-a716-446655440000"
    }
  }
  ```
- **错误码**:
  - 400: 参数无效或图片格式不支持
  - 500: 服务器内部错误

### 4. 相册相关接口

#### POST /api/v1/albums

- **描述**: 创建新相册
- **认证**: 需要（Cookie）
- **Content-Type**: application/json
- **请求体**:
  ```json
  {
    "mainArea": "主要区域",
    "subArea": "子区域",
    "date": "2024-01-01",
    "photos": [
      {
        "imageId": "550e8400-e29b-41d4-a716-446655440000",
        "title": "照片标题",
        "description": "照片描述",
        "isPost": true
      }
    ]
  }
  ```
- **约束**:
  - 每个相册只能有一张 `isPost: true` 的封面照片
  - `photos` 不能为空数组
- **响应示例**:
  ```json
  {
    "code": 200,
    "data": {}
  }
  ```

#### GET /api/v1/albums

- **描述**: 获取相册详情列表，默认按 `date` 倒序返回
- **认证**: 需要（Cookie）
- **查询参数**:
  - `query`：可选，按关键字过滤 `mainArea` 或 `subArea`，包含匹配
  - `start_date`：可选，起始日期，包含边界，例如 `2024-01-01`
  - `end_date`：可选，结束日期，包含边界，例如 `2024-12-31`
  - `page`：可选，页码，从 `1` 开始
  - `page_size`：可选，每页数量
- **说明**:
  - 不传筛选和分页参数时，保持原有全量返回逻辑，仅新增按 `date` 倒序排序
  - 可组合使用关键字、日期范围和分页参数
  - 响应中的 `total` 表示当前筛选条件下的总记录数，不受分页参数影响
- **响应示例**:
  ```json
  {
    "code": 200,
    "data": {
      "total": 42,
      "albums": [
        {
          "id": "album-uuid-1",
          "mainArea": "主要区域",
          "subArea": "子区域",
          "date": "2024-01-01",
          "photos": [
            {
              "id": "photo-uuid-1",
              "title": "照片标题",
              "description": "照片描述",
              "isPost": true,
              "image": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "objectPath": "images/filename.jpg",
                "sha256": "sha256-hash",
                "proxied": {
                  "480p": "images/filename_480p.jpg",
                  "720p": "images/filename_720p.jpg",
                  "1080p": "images/filename_1080p.jpg"
                },
                "exif": {
                  "manufacturer": "Canon",
                  "model": "EOS 5D Mark IV",
                  "dateTime": "2024-01-01T12:00:00.000Z",
                  "exposureTime": "1/125",
                  "fNumber": "f/2.8",
                  "focalLength": "50mm",
                  "iso": "100",
                  "lens": "EF 50mm f/1.8 STM",
                  "ev": "0",
                  "gpsLatitude": 39.9042,
                  "gpsLongitude": 116.4074
                }
              }
            }
          ]
        }
      ]
    }
  }
  ```

#### GET /api/v1/albums/meta

- **描述**: 获取相册元数据（仅包含封面信息），默认按 `date` 倒序返回
- **认证**: 不需要
- **查询参数**:
  - `page`：可选，页码，从 `1` 开始
  - `page_size`：可选，每页数量
- **说明**:
  - 不传分页参数时，保持原有全量返回逻辑，仅新增按 `date` 倒序排序
- **响应示例**:
  ```json
  {
    "code": 200,
    "data": {
      "albums": [
        {
          "id": "album-uuid-1",
          "mainArea": "主要区域",
          "subArea": "子区域",
          "date": "2024-01-01",
          "poster": {
            "objectPath": "images/filename.jpg",
            "proxied": {
              "480p": "images/filename_480p.jpg",
              "720p": "images/filename_720p.jpg",
              "1080p": "images/filename_1080p.jpg"
            }
          }
        }
      ]
    }
  }
  ```

#### GET /api/v1/albums/:albumId

- **描述**: 获取单个相册详情（仅包含设置为展示的照片）
- **认证**: 不需要
- **参数**:
  - `albumId`: 相册 ID（路径参数）
- **响应示例**:
  ```json
  {
    "code": 200,
    "data": {
      "album": {
        "id": "album-uuid-1",
        "mainArea": "主要区域",
        "subArea": "子区域",
        "date": "2024-01-01",
        "photos": [
          {
            "id": "photo-uuid-1",
            "title": "照片标题",
            "description": "照片描述",
            "isPost": true,
            "image": {
              "id": "550e8400-e29b-41d4-a716-446655440000",
              "objectPath": "images/filename.jpg",
              "sha256": "sha256-hash",
              "proxied": {
                "480p": "images/filename_480p.jpg",
                "720p": "images/filename_720p.jpg",
                "1080p": "images/filename_1080p.jpg"
              },
              "exif": {
                "manufacturer": "Canon",
                "model": "EOS 5D Mark IV",
                "dateTime": "2024-01-01T12:00:00.000Z",
                "exposureTime": "1/125",
                "fNumber": "f/2.8",
                "focalLength": "50mm",
                "iso": "100",
                "lens": "EF 50mm f/1.8 STM",
                "ev": "0",
                "gpsLatitude": 39.9042,
                "gpsLongitude": 116.4074
              }
            }
          }
        ]
      }
    }
  }
  ```

#### PUT /api/v1/albums/:albumId

- **描述**: 更新指定相册（会覆盖原相册信息和照片列表）
- **认证**: 需要（Cookie）
- **Content-Type**: application/json
- **参数**:
  - `albumId`: 相册 ID（路径参数）
- **请求体**:
  ```json
  {
    "mainArea": "更新后的主要区域",
    "subArea": "更新后的子区域",
    "date": "2024-02-01",
    "photos": [
      {
        "imageId": "550e8400-e29b-41d4-a716-446655440000",
        "title": "更新后的照片标题",
        "description": "更新后的照片描述",
        "isPost": true
      }
    ]
  }
  ```
- **约束**:
  - 每个相册只能有一张 `isPost: true` 的封面照片
  - `photos` 不能为空数组
- **响应示例**:
  ```json
  {
    "code": 200,
    "data": {}
  }
  ```

#### DELETE /api/v1/albums/:albumId

- **描述**: 删除指定相册及其关联照片记录
- **认证**: 需要（Cookie）
- **参数**:
  - `albumId`: 相册 ID（路径参数）
- **响应示例**:
  ```json
  {
    "code": 200,
    "data": {}
  }
  ```

## 数据模型

### User 用户模型

```typescript
interface User {
  id: number; // 用户ID
  username: string; // 用户名
  faceUrl: string; // 头像URL
  nickname: string; // 昵称
  selfInfo: string; // 个人简介
}
```

### Image 图片模型

```typescript
interface ImageModel {
  id: string; // 图片ID
  objectPath: string; // 原始图片对象存储路径
  sha256: string; // 图片SHA256哈希
  proxied: {
    '480p'?: string; // 480p分辨率图片路径
    '720p'?: string; // 720p分辨率图片路径
    '1080p'?: string; // 1080p分辨率图片路径
  };
  exif: {
    manufacturer?: string; // 相机制造商
    model?: string; // 相机型号
    dateTime?: string; // 拍摄时间
    exposureTime?: string; // 曝光时间
    fNumber?: string; // 光圈值
    focalLength?: string; // 焦距
    iso?: string; // ISO值
    lens?: string; // 镜头信息
    ev?: string; // 曝光补偿
    gpsLatitude?: number; // GPS纬度
    gpsLongitude?: number; // GPS经度
  };
}
```

### Photo 照片模型

```typescript
interface PhotoModel {
  id?: string; // 照片ID
  isPost: boolean; // 是否作为封面展示
  title: string; // 照片标题
  description: string; // 照片描述
}
```

### Album 相册模型

```typescript
interface AlbumModel {
  id?: string; // 相册ID
  date: string; // 拍摄日期
  mainArea: string; // 主要区域
  subArea: string; // 子区域
}
```

## 错误码说明

- `400`: 参数无效
- `404`: 资源未找到（如相册不存在、图片不存在等）
- `415`: 图片格式不支持
- `500`: 服务器内部错误

## 注意事项

1. 所有需要认证的接口都需要携带有效的 Cookie
2. 图片上传后会自动生成多种分辨率版本
3. 每个相册必须有且仅有一张封面照片（isPost: true）
4. 时间格式统一使用 ISO 8601 格式
