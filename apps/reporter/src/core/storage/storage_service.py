import logging
import os
from abc import ABC, abstractmethod

logger = logging.getLogger(__name__)


class IStorage(ABC):
    """Interface for storage operations."""

    @abstractmethod
    def download_file(self, remote_path: str, local_path: str) -> bool:
        """Download a file from remote storage to local filesystem."""
        pass

    @abstractmethod
    def upload_file(self, local_path: str, remote_path: str) -> bool:
        """Upload a file from local filesystem to remote storage."""
        pass

    @abstractmethod
    def list_files(self, prefix: str) -> list[str]:
        """List files in the storage with a given prefix."""
        pass


class LocalStorage(IStorage):
    """Local-only implementation (noop for sync)."""

    def download_file(self, remote_path: str, local_path: str) -> bool:
        logger.debug(f"LocalStorage: No-op download from {remote_path}")
        return os.path.exists(local_path)

    def upload_file(self, local_path: str, remote_path: str) -> bool:
        logger.debug(f"LocalStorage: No-op upload to {remote_path}")
        return True

    def list_files(self, prefix: str) -> list[str]:
        # Return local files matching prefix
        return []


class GCSStorage(IStorage):
    """Google Cloud Storage implementation."""

    def __init__(self, bucket_name: str):
        from google.cloud import storage

        self.client = storage.Client()
        self.bucket = self.client.bucket(bucket_name)

    def download_file(self, remote_path: str, local_path: str) -> bool:
        try:
            blob = self.bucket.blob(remote_path)
            if not blob.exists():
                logger.warning(f"GCS: File not found: {remote_path}")
                return False

            os.makedirs(os.path.dirname(local_path), exist_ok=True)
            blob.download_to_filename(local_path)
            logger.info(f"GCS: Downloaded {remote_path} to {local_path}")
            return True
        except Exception as e:
            logger.error(f"GCS: Download failed: {e}")
            return False

    def upload_file(self, local_path: str, remote_path: str) -> bool:
        try:
            if not os.path.exists(local_path):
                logger.error(f"GCS: Local file not found: {local_path}")
                return False

            blob = self.bucket.blob(remote_path)
            blob.upload_from_filename(local_path)
            logger.info(f"GCS: Uploaded {local_path} to {remote_path}")
            return True
        except Exception as e:
            logger.error(f"GCS: Upload failed: {e}")
            return False

    def list_files(self, prefix: str) -> list[str]:
        try:
            blobs = self.client.list_blobs(self.bucket, prefix=prefix)
            return [blob.name for blob in blobs]
        except Exception as e:
            logger.error(f"GCS: List failed: {e}")
            return []
