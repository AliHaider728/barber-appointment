import { ImageIcon } from 'lucide-react';

const ImageCard = ({ src, alt = "Image", className = "w-full h-48 object-cover rounded-lg" }) => {
  const placeholder = 'https://via.placeholder.com/600x400?text=No+Image';

  return src ? (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => (e.currentTarget.src = placeholder)}
    />
  ) : (
    <div className={`${className} flex items-center justify-center bg-gray-100`}>
      <ImageIcon className="w-12 h-12 text-gray-400" />
    </div>
  );
};

export default ImageCard;