import * as React from "react";
import { Card, CardBody, CardSubtitle, CardTitle, Col, Row } from "reactstrap";

interface ISearchResultProp {
  result: google.maps.places.PlaceResult;
  onSelect: (place: google.maps.places.PlaceResult) => void;
}

export default class SearchResult extends React.Component<
  ISearchResultProp,
  any
> {
  constructor(props: ISearchResultProp) {
    super(props);
  }

  render() {
    return (
      <Col xl="3" lg="4" md="6" className="mt-2 mb-2">
        <Card
          className="h-100"
          onClick={() => this.props.onSelect(this.props.result)}
        >
          <CardBody>
            <CardTitle className="text-center">
              {this.props.result.name}
            </CardTitle>
          </CardBody>
          {this.props.result.photos.length > 0 ? (
            <div
              className="biz-image"
              style={{
                backgroundImage:
                  "url(" +
                  this.props.result.photos[0].getUrl({
                    maxHeight: 250
                  }) +
                  ")",
                height: "250px"
              }}
            />
          ) : null}
          <CardBody>
            <CardSubtitle>{this.props.result.formatted_address}</CardSubtitle>
          </CardBody>
        </Card>
      </Col>
    );
  }
}
