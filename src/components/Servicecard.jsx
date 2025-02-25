import { Card, CardBody, CardHeader } from "@nextui-org/react";

const Servicecard = ({ serivce }) => {
  return (
    <Card className="bg-foreground py-2">
      <CardHeader className="flex-col items-start px-4 pb-0 pt-2 text-primary-600">
        <div className="flex w-full items-center justify-center">
          {serivce.icon}
        </div>
      </CardHeader>
      <CardBody className="overflow-visible py-1">
        <h4 className="mb-2 text-center text-lg font-bold text-copy">
          {serivce.name}
        </h4>
        <small className="text-center text-copy-light">{serivce.desc}</small>
      </CardBody>
    </Card>
  );
};

export default Servicecard;
