from storages.backends.s3boto3 import S3Boto3Storage

class MediaStorage(S3Boto3Storage):
    location = 'media'
    #default_acl = 'public-read'
    file_overwrite = False

class S3Storage(S3Boto3Storage):
    @property
    def connection(self):
        if self._connection is None:
            self._connection = self.connection_class(
                self.access_key, self.secret_key,
                calling_format=self.calling_format, host='s3.eu-central-1.amazonaws.com')
        return self._connection
