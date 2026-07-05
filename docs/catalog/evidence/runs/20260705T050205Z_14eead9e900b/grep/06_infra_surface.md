# grep: infra_surface

evidence_id: ev.grep.infra_surface
description: iac / gcp / ci / container surface

- supabase/config.toml:L120: # Uncomment to configure local storage buckets
- supabase/config.toml:L121: # [storage.buckets.images]
- supabase/config.toml:L143: # Analytics Buckets is available to Supabase Pro plan.
- supabase/config.toml:L144: # [storage.analytics.buckets.my-warehouse]
- supabase/config.toml:L149: max_buckets = 10
- supabase/config.toml:L152: # Vector Buckets is available to Supabase Pro plan.
- supabase/config.toml:L153: # [storage.vector.buckets.documents-openai]
- supabase/config.toml:L319: # Use an external OAuth provider. The full list of providers are: `apple`, `azure`, `bitbucket`,
- supabase/config.toml:L398: # Configures S3 bucket URL, eg. <bucket_name>.s3-<region>.amazonaws.com
- supabase/config.toml:L400: # Configures S3 bucket region, eg. us-east-1
- supabase/config.toml:L402: # Configures AWS_ACCESS_KEY_ID for S3 bucket
- supabase/config.toml:L404: # Configures AWS_SECRET_ACCESS_KEY for S3 bucket
