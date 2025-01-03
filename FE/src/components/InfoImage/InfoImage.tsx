import "./InfoImage.scss";

export interface InfoImage {
  title: string;
  description: string;
}

interface InfoImageProps {
  header: string;
  items: InfoImage[];
  images?: string[]; // Optional for images
  className?: string; // Optional for additional styling or customization
}

const InfoImage: React.FC<InfoImageProps> = ({
  header,
  items,
  images,
  className,
}) => {
  return (
    <div className={`info-image ${className || ""}`}>
      <h2 className="info-image__header">{header}</h2>
      <div className="info-image__list">
        {items.map((item, index) => (
          <div className="info-image__item" key={index}>
            {images && images[index] && (
              <img
                src={images[index]}
                alt={item.title}
                className="info-image__image"
              />
            )}
            <h3 className="info-image__title text-pink-100">{item.title}</h3>
            <p className="info-image__text">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoImage;
