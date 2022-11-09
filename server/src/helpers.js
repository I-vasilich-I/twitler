import { unlink } from 'fs/promises';

const deleteFile = async (path) => {
  try {
    await unlink(path);
  } catch {}
}

export { deleteFile }
