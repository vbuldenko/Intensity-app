import "./InfoSection.scss";

interface InfoItem {
  title: string;
  description: string;
}

interface InfoSectionProps {
  header: string;
  items: InfoItem[];
  className?: string; // Optional for additional styling or customization
}

const InfoSection: React.FC<InfoSectionProps> = ({
  header,
  items,
  className,
}) => {
  return (
    <div className={`info-section ${className || ""}`}>
      <h1 className="info-section__header">{header}</h1>
      <div className="info-section__list">
        {items.map((item, index) => (
          <div className="info-section__item card-element" key={index}>
            <h2 className="info-section__title">{item.title}</h2>
            <p className="info-section__text">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoSection;
