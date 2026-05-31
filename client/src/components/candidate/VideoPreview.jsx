export default function VideoPreview({ previewUrl, label = 'Preview' }) {
  if (!previewUrl) return null;

  return (
    <div className="video-preview">
      <h4>{label}</h4>
      <video src={previewUrl} controls playsInline className="video-preview__player" />
    </div>
  );
}
