from storages.backends.s3boto3 import S3Boto3Storage
from whitenoise.storage import CompressedManifestStaticFilesStorage

class MediaStorage(S3Boto3Storage):
    location = 'media'
    default_acl = None
    file_overwrite = False

class WhiteNoiseStorage(CompressedManifestStaticFilesStorage):
    manifest_strict = False
