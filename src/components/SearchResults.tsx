import * as React from "react";
import { Card, CardBody, CardSubtitle, CardTitle, Col, Row } from "reactstrap";
import SearchResult from "./SearchResult";

export interface ISearchResultsProps {
  searchResults: google.maps.places.PlaceResult[];
  onSelect: (place: google.maps.places.PlaceResult) => void;
}

export interface ISearchResultsState {}

export default class SearchResults extends React.Component<
  ISearchResultsProps,
  ISearchResultsState
> {
  constructor(props: ISearchResultsProps) {
    super(props);

    this.state = {};
  }

  render() {
    return this.props.searchResults.length > 0 ? (
      <Row className="equal">
        {this.props.searchResults.map((item, index) => (
          <SearchResult
            result={item}
            onSelect={this.props.onSelect}
            key={item.id}
          />
        ))}
      </Row>
    ) : null;
  }
}
