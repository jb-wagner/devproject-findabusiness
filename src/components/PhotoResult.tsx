import * as React from "react";
import { Col, Card, CardBody, CardSubtitle } from "reactstrap";

export interface IPhotoResult {
  tags: string[];
  imageUrl: string;
}

interface IPhotoResultProps {
  photoResult: IPhotoResult;
}

export class PhotoResult extends React.Component<IPhotoResultProps, any> {
  constructor(props: IPhotoResultProps) {
    super(props);
  }

  render() {
    return (
      <Col xl="3" lg="4" md="6" className="mt-2 mb-2">
        <Card className="h-100">
          <div
            className="biz-image"
            style={{
              backgroundImage: "url(" + this.props.photoResult.imageUrl + ")",
              height: "250px"
            }}
          />
          <CardBody>
            <CardSubtitle>
              {this.props.photoResult.tags.join(", ")}
            </CardSubtitle>
          </CardBody>
        </Card>
      </Col>
    );
  }
}
