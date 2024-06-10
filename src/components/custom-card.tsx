import { Card, Badge, Button } from "react-daisyui";

const CustomCard: React.FC<CardProps> = ({ title, image, description }) => {
  return (
    <Card className="glass">
      <figure className="px-1 pt-1">
        <img
          src={image}
          alt="Shoes"
          className="rounded-xl w-max-[640px] h-max-[320px]"
        />
      </figure>

      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <p>{description}</p>
      </Card.Body>
      <Card.Actions className="flex justify-end">
        <div className="w-full flex flex-row justify-end gap-1 pb-1 pr-3">
          <Badge color="accent" variant="outline">
            celestron
          </Badge>
          <Badge color="success" variant="outline">
            sv305
          </Badge>
          <Badge color="secondary" variant="outline">
            planetary
          </Badge>
        </div>
        <div className="w-full flex flex-row justify-end gap-5 pb-3 pr-3">
          <Button color="accent" size="sm" variant="outline">
            Open
          </Button>
        </div>
      </Card.Actions>
    </Card>
  );
};

export default CustomCard;
