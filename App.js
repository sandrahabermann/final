import React from 'react';
import { ListView, StyleSheet, View } from 'react-native';
import { Body, Title, Right, Container, Header, Content, Button, Icon, List, ListItem, Text } from 'native-base';

export default class App extends React.Component {
  constructor(){
    super();
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state={
      movies:[]
    }
  }

  getMovies() {

    let airtableUrl = "https://api.airtable.com/v0/appFkOft03YU75SYx/series?&view=Grid%20view";

    let requestOptions = {
      headers: new Headers({
        'Authorization': 'Bearer keyRROgCiVix7kfC0'
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      console.log(json)
      this.setState({
        movies: json.records
      });
    });
  }

  componentDidMount() {
      this.getMovies(); // refresh the list when we're done
    }
    // liked a movie
      uptoviewMovies(data, secId, rowId, rowMap) {
        // Slide the row back into place
        rowMap[`${secId}${rowId}`].props.closeRow();

        // Airtable API endpoint
        let airtableUrl = "https://api.airtable.com/v0/appFkOft03YU75SYx/series/" + data.id;

        // Needed for Airtable authorization
        let requestOptions = {
          method: 'PATCH',
          headers: new Headers({
            'Authorization': 'Bearer keyRROgCiVix7kfC0',
            'Content-type': 'application/json'
          }),
          body: JSON.stringify({
            fields: {
              toview: true
            }
          })
        };

        // Form the request
        let request = new Request(airtableUrl, requestOptions);

        // Make the request
        fetch(request).then(response => response.json()).then(json => {
          this.getMovies(); // refresh the list when we're done
        });
      }


      // Delete a movie
      deleteMovies(data, secId, rowId, rowMap) {
        // Slide the row back into place
        rowMap[`${secId}${rowId}`].props.closeRow();

        // Create a new array that has the movie removed
        let newMoviesData = this.state.movies.slice();
        newMoviesData.splice(rowId, 1);

        // Airtable API endpoint
        let airtableUrl = "https://api.airtable.com/v0/appFkOft03YU75SYx/series/" + data.id;

        // Needed for Airtable authorization
        let requestOptions = {
          method: 'DELETE',
          headers: new Headers({
            'Authorization': 'Bearer keyRROgCiVix7kfC0', // replace with your own API key
            'Content-type': 'application/json'
          })
        };

        // Form the request
        let request = new Request(airtableUrl, requestOptions);

        // Make the request
        fetch(request).then(response => response.json()).then(json => {
          this.getMovies(); // refresh the list when we're done
        });
      }

      // The UI for each row of data
      renderRow(data) {
        let seen ="";
        if (data.fields.toview) {
          seen="seen"
        }


        return (
          <ListItem style={{ paddingLeft: 20, paddingRight: 20 }}>
            <Body>
              <Text>{data.fields.series}</Text>
            </Body>
            <Right>
              <Text note>{seen}</Text>
            </Right>
          </ListItem>
        )
      }

      // The UI for what appears when you swipe right
      renderSwipeRight(data, secId, rowId, rowMap) {
        return (
          <Button full success onPress={() => this.uptoviewMovies(data, secId, rowId, rowMap)}>
            <Icon active name="thumbs-up" />
          </Button>
        )
      }

      // The UI for what appears when you swipe left
      renderSwipeLeft(data, secId, rowId, rowMap) {
        return (
          <Button full danger onPress={() => this.deleteMovies(data, secId, rowId, rowMap)}>
            <Icon active name="thumbs-down" />
          </Button>
        )
      }

  render() {
    let rows = this.ds.cloneWithRows(this.state.movies);
    return (
      <Container>
        <Header>
          <Body>
            <Title>Series List</Title>
          </Body>
        </Header>
        <Content>
          <List
            dataSource={rows}
            renderRow={(data) => this.renderRow(data)}
            renderLeftHiddenRow={(data, secId, rowId, rowMap) => this.renderSwipeRight(data, secId, rowId, rowMap)}
            renderRightHiddenRow={(data, secId, rowId, rowMap) => this.renderSwipeLeft(data, secId, rowId, rowMap)}
            leftOpenValue={75}
            rightOpenValue={-75}
          />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
