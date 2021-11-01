import { Provider, RegionInfoProvider } from "@aws-sdk/types";

export interface BucketEndpointInputConfig {
  /**
   * Whether the provided endpoint addresses an individual bucket.
   */
  bucketEndpoint?: boolean;
  /**
   * Whether to force path style URLs for S3 objects (e.g., https://s3.amazonaws.com/<bucketName>/<key> instead of https://<bucketName>.s3.amazonaws.com/<key>
   */
  forcePathStyle?: boolean;
  /**
   * Whether to use the S3 Transfer Acceleration endpoint by default
   */
  useAccelerateEndpoint?: boolean;
  /**
   * Whether to override the request region with the region inferred from requested resource's ARN. Defaults to false
   */
  useArnRegion?: boolean | Provider<boolean>;
  /**
   * Whether to prevent SDK from making cross-region request when supplied bucket is a multi-region access point ARN.
   * Defaults to false
   */
  disableMultiregionAccessPoints?: boolean | Provider<boolean>;
}

interface PreviouslyResolved {
  isCustomEndpoint: boolean;
  region: Provider<string>;
  regionInfoProvider: RegionInfoProvider;
  useDualstackEndpoint: Provider<boolean>;
}

export interface BucketEndpointResolvedConfig {
  /**
   * Whether the endpoint is specified by caller.
   * @internal
   */
  isCustomEndpoint: boolean;
  /**
   * Resolved value for input config {@link BucketEndpointInputConfig.bucketEndpoint}
   */
  bucketEndpoint: boolean;
  /**
   * Resolved value for input config {@link BucketEndpointInputConfig.forcePathStyle}
   */
  forcePathStyle: boolean;
  /**
   * Resolved value for input config {@link BucketEndpointInputConfig.useAccelerateEndpoint}
   */
  useAccelerateEndpoint: boolean;
  /**
   * Enables IPv6/IPv4 dualstack endpoint.
   */
  useDualstackEndpoint: Provider<boolean>;
  /**
   * Resolved value for input config {@link BucketEndpointInputConfig.useArnRegion}
   */
  useArnRegion: Provider<boolean>;
  /**
   * Resolved value for input config {@link RegionInputConfig.region}
   */
  region: Provider<string>;
  /**
   * Fetch related hostname, signing name or signing region with given region.
   * @internal
   */
  regionInfoProvider: RegionInfoProvider;
  disableMultiregionAccessPoints: Provider<boolean>;
}

export function resolveBucketEndpointConfig<T>(
  input: T & PreviouslyResolved & BucketEndpointInputConfig
): T & BucketEndpointResolvedConfig {
  const {
    bucketEndpoint = false,
    forcePathStyle = false,
    useAccelerateEndpoint = false,
    useArnRegion = false,
    disableMultiregionAccessPoints = false,
  } = input;
  return {
    ...input,
    bucketEndpoint,
    forcePathStyle,
    useAccelerateEndpoint,
    useArnRegion: typeof useArnRegion === "function" ? useArnRegion : () => Promise.resolve(useArnRegion),
    disableMultiregionAccessPoints:
      typeof disableMultiregionAccessPoints === "function"
        ? disableMultiregionAccessPoints
        : () => Promise.resolve(disableMultiregionAccessPoints),
  };
}
