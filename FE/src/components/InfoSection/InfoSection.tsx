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
      <h2 className="info-section__header">{header}</h2>
      <div className="info-section__list">
        {items.map((item, index) => (
          <div className="info-section__item card-element" key={index}>
            <h3 className="info-section__title">{item.title}</h3>
            <p className="info-section__text">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoSection;
