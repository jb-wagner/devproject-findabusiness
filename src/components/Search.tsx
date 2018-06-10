import * as React from "react";
import { Button, Col, Progress, Row, UncontrolledAlert } from "reactstrap";
import predict from "../service/predict";
import { IPhotoResult, PhotoResult } from "./PhotoResult";
import SearchForm, { ISearchFormFields } from "./SearchForm";
import SearchResults from "./SearchResults";

export interface ISearchProps {}

export enum SearchStateShowing {
  SEARCH,
  SEARCH_RESULTS,
  BUSINESS_PHOTOS
}

export interface ISearchState {
  busy: boolean;
  showing: SearchStateShowing;
  searchResults: google.maps.places.PlaceResult[];
  selectedBusiness: google.maps.places.PlaceResult;
  photoResults: IPhotoResult[];
  alert: string;
}

export default class Search extends React.Component<
  ISearchProps,
  ISearchState
> {
  private static initialState: ISearchState = {
    showing: SearchStateShowing.SEARCH,
    busy: false,
    searchResults: [],
    selectedBusiness: null,
    photoResults: [],
    alert: null
  };

  private placesService: google.maps.places.PlacesService;

  constructor(props: ISearchProps) {
    super(props);

    this.placesService = new google.maps.places.PlacesService(
      document.createElement("div")
    );

    this.onSearch = this.onSearch.bind(this);
    this.onSelectPlace = this.onSelectPlace.bind(this);
    this.onBackToSearch = this.onBackToSearch.bind(this);
    this.onPlaceDetails = this.onPlaceDetails.bind(this);

    this.state = Search.initialState;
  }

  onBackToSearch(evt: React.MouseEvent<HTMLButtonElement>) {
    this.setState(Search.initialState);
  }

  onSelectPlace(place: google.maps.places.PlaceResult) {
    this.setState({
      selectedBusiness: place,
      busy: true
    });

    this.placesService.getDetails(
      { placeId: place.place_id },
      (place, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          // TODO : handle error
          console.error(status);
          return;
        }
        this.onPlaceDetails(place);
      }
    );
  }

  onPlaceDetails(place: google.maps.places.PlaceResult) {
    let requestedImages = 0;

    let updateRequestedImages = (() => {
      requestedImages -= 1;
      if (requestedImages == 0) {
        this.setState({
          busy: false,
          showing: SearchStateShowing.BUSINESS_PHOTOS
        });
      }
    }).bind(this);

    place.photos.slice(0, Math.min(5, place.photos.length)).map((
      photo,
      _index /* unused */
    ) => {
      requestedImages += 1;
      let url: string = photo.getUrl({
        maxWidth: 300,
        maxHeight: 300
      });
      predict(
        url,
        (response: any) => {
          let tags: string[] = response.outputs[0].data.concepts
            .slice(0, 5)
            .map((concept: any, index: number) => concept.name);

          let photoResult: IPhotoResult = {
            imageUrl: url,
            tags: tags
          };

          this.setState({
            photoResults: [...this.state.photoResults, photoResult]
          });

          updateRequestedImages();
        },
        (error: any) => {
          console.error(error);
          updateRequestedImages();
        }
      );
    });
  }

  onSearch(fields: ISearchFormFields) {
    if (!(fields.businessName && fields.businessName.trim().length > 0)) {
      this.setState({ alert: "Business Name cannot be empty" });
      return;
    }

    this.setState({ busy: true, alert: null });

    this.placesService.textSearch(
      {
        query: fields.zip + " " + fields.businessName
      },
      (
        results: google.maps.places.PlaceResult[],
        status: google.maps.places.PlacesServiceStatus,
        _pagination: google.maps.places.PlaceSearchPagination /* unused */
        // TODO: handle pagination
      ) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          // TODO: handle error
          console.error(status);
        }

        this.setState({
          busy: false,
          searchResults: results,
          showing: SearchStateShowing.SEARCH_RESULTS
        });
      }
    );
  }

  render() {
    return (
      <React.Fragment>
        {this.state.alert && this.state.alert.trim().length > 0 ? (
          <UncontrolledAlert color="info">{this.state.alert}</UncontrolledAlert>
        ) : null}

        {this.state.showing == SearchStateShowing.SEARCH ? (
          <SearchForm onSearch={this.onSearch} disabled={this.state.busy} />
        ) : null}

        {this.state.busy ? (
          <Row>
            <Col>
              <Progress animated color="primary" value="100" />
            </Col>
          </Row>
        ) : null}

        {this.state.showing == SearchStateShowing.SEARCH_RESULTS ||
        this.state.showing == SearchStateShowing.BUSINESS_PHOTOS ? (
          <Row>
            <Col>
              <Button
                className="mb-2 mt-2"
                style={{ float: "right" }}
                onClick={this.onBackToSearch}
              >
                Back To Search
              </Button>
            </Col>
          </Row>
        ) : null}

        {this.state.showing == SearchStateShowing.SEARCH_RESULTS &&
        this.state.searchResults.length > 0 ? (
          <SearchResults
            searchResults={this.state.searchResults}
            onSelect={this.onSelectPlace}
          />
        ) : null}

        {this.state.showing == SearchStateShowing.BUSINESS_PHOTOS &&
        this.state.selectedBusiness != null ? (
          <Row>
            <Col>
              <div className="shadow p-3 rounded">
                <h4>{this.state.selectedBusiness.name}</h4>
                <h5>{this.state.selectedBusiness.formatted_address}</h5>
              </div>
            </Col>
          </Row>
        ) : null}

        {this.state.showing == SearchStateShowing.BUSINESS_PHOTOS &&
        this.state.photoResults.length > 0 ? (
          <Row>
            {this.state.photoResults.map((pr, index) => (
              <PhotoResult key={pr.imageUrl} photoResult={pr} />
            ))}
          </Row>
        ) : null}
      </React.Fragment>
    );
  }
}
