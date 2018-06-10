import * as React from "react";
import * as FontAwesome from "react-icons/lib/fa";
import { Button, Form, FormGroup, Input, Row } from "reactstrap";

export interface ISearchFormFields {
  zip: string;
  businessName: string;
}

interface ISearchFormProps {
  onSearch: (fields: ISearchFormFields) => void;
  disabled: boolean;
}

interface ISearchFormState extends ISearchFormFields {
  zip: string;
  businessName: string;
}

export default class SearchForm extends React.Component<
  ISearchFormProps,
  ISearchFormState
> {
  private placesService: google.maps.places.PlacesService;

  constructor(props: ISearchFormProps) {
    super(props);

    this.handleZipChange = this.handleZipChange.bind(this);
    this.handleBusinessName = this.handleBusinessName.bind(this);
  }

  handleZipChange(evt: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ zip: evt.target.value });
  }

  handleBusinessName(evt: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ businessName: evt.target.value });
  }

  render() {
    return (
      <Form
        onSubmit={(evt: React.ChangeEvent<HTMLFormElement>) => {
          evt.preventDefault();
          this.props.onSearch({
            zip: this.state.zip,
            businessName: this.state.businessName
          });
          return false;
        }}
      >
        <Row>
          <FormGroup className="col-sm-3">
            <Input
              type="text"
              name="zip"
              placeholder="Zip"
              pattern="\d{5}-?(\d{4})?"
              required={true}
              title="Zip code format is: XXXXX or XXXXX-XXXX"
              onChange={this.handleZipChange}
            />
          </FormGroup>
          <FormGroup className="col-sm-7">
            <Input
              type="text"
              name="bizName"
              placeholder="Business Name"
              required={true}
              onChange={this.handleBusinessName}
            />
          </FormGroup>
          <FormGroup className="col-sm-2">
            <Button type="submit" disabled={this.props.disabled}>
              <FontAwesome.FaSearch />
            </Button>
          </FormGroup>
        </Row>
      </Form>
    );
  }
}
