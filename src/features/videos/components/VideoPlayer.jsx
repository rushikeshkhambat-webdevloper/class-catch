import { getVideoUrl } from '../services/videoService';

export default function VideoPlayer({ fileId }) {
  const url = getVideoUrl(fileId);
  return (
    <video
      controls
      src={url}
      className="w-full rounded-xl bg-black aspect-video"
      preload="metadata"
    />
  );
}