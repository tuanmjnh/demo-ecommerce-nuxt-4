export { }
declare global {
  namespace Cloudinary {
    /**
     * Interface for the object containing information about the last update time of the resource.
     */
    export interface ILastUpdated {
      /** The time the public_id was last updated (UTC) */
      public_id_updated_at: string;
      /** The general time the resource was last updated (UTC) */
      updated_at: string;
    }

    export interface IResponseSignature {
      message: string,
      status: boolean,
      timestamp: number
      signature: string
      cloudName: string
      apiKey: string
      preset: string
    }

    export interface IFolder {
      /** The name of the folder (last part of the path). */
      name: string;
      /** The full path of the folder, relative to the root or parent folder. */
      path: string;
      /** An optional external ID for tracking purposes (may be null/undefined if not set). */
      external_id: string | null;
      children?: IFolder[];
      hasChildren?: boolean;
      childrenLoaded?: boolean;
    }

    export interface IResponseFolder {
      /** An array of folder objects found on the current page. */
      folders: IFolder[];

      /** Cursor for fetching the next page of results (pagination).
       * Since folders often don't require deep pagination, this is often null.
       */
      next_cursor: string | null;

      /** The total number of API calls allowed in the current rate limit window. */
      rate_limit_allowed: number;

      /** The number of API calls remaining in the current rate limit window. */
      rate_limit_remaining: number;

      /** The time (UTC) when the rate limit will reset to the full allowed amount. */
      rate_limit_reset_at: string;

      /** The total number of folders returned in the current scope. */
      total_count: number;
    }
    export interface IResponseFolders {
      parent: string
      folders: IFolder[]
    }
    /**
     * Interface for the Resource object returned from the Cloudinary Admin API.
     * Represents an uploaded file (image, video, raw).
     */
    export interface IResource {
      /** The folder where the file is stored in Cloudinary */
      asset_folder: string;
      /** The unique asset ID in Cloudinary */
      asset_id: string;
      /** File size in bytes */
      bytes: number;
      /** The creation (upload) time of the file (ISO 8601 format) */
      created_at: string;
      /** Display name (usually the original filename) */
      display_name: string;
      /** File format (e.g., "png", "jpg", "mp4") */
      format: string;
      /** Height of the resource (if image/video) */
      height: number;
      /** Detailed information about the last update time */
      last_updated: ILastUpdated;
      /** The public ID, used to access and transform the file */
      public_id: string;
      /** The type of resource (e.g., "image", "video", "raw") */
      resource_type: 'image' | 'video' | 'raw' | string;
      /** The secure URL (HTTPS) for accessing the resource */
      secure_url: string;
      /** The type of upload (usually "upload") */
      type: string;
      /** The non-secure URL (HTTP) for accessing the resource */
      url: string;
      /** The version of the file (often a timestamp) */
      version: number;
      /** Width of the resource (if image/video) */
      width: number;
    }

    export interface IResponseAsset {
      /** * Cursor for fetching the next page of results (pagination).
       * If present, you should include this in the next API call to get more resources.
       * If null or undefined, you have reached the last page.
       */
      next_cursor?: string;

      /** * The total number of API calls allowed in the current rate limit window.
       */
      rate_limit_allowed: number;

      /** * The number of API calls remaining in the current rate limit window.
       */
      rate_limit_remaining: number;

      /** * The time (UTC) when the rate limit will reset to the full allowed amount.
       */
      rate_limit_reset_at: string;

      /** * An array of Cloudinary resource objects found on the current page.
       */
      resources: IResource[];
    }
  }
}
