import React, { Component } from "react";
import Notification from "./Notification";

export default class NotificationListener extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      sharedCount: {},
      showNotification: false
    }
  }

  componentDidMount() {
    this.timer = setInterval(
      () => this.tick(),
      5000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  tick() {

    // Check for changes in shared docs
    getFile("contact.json", {decrypt: true})
      .then((fileContents) => {
        if(fileContents) {
          console.log("Contacts are here");
          this.setState({ contacts: JSON.parse(fileContents || '{}').contacts });
          this.setState({ filteredContacts: this.state.contacts });
        } else {
          console.log("No contacts");
        }
      })
      .catch(error => {
        console.log(error);
      });

    let contacts = this.state.contacts;

    contacts.forEach( function (contact) {
      let fileID = contact.contact;
      let fileString = 'shareddocs.json';
      let file = fileID.slice(0, -3) + fileString;
      const directory = '/shared/' + file;


      getFile(directory, options)
        .then((fileContents) => {
          let privateKey = loadUserData().appPrivateKey;
          console.log(JSON.parse(decryptECIES(privateKey, JSON.parse(fileContents))));
          let docs = JSON.parse(decryptECIES(privateKey, JSON.parse(fileContents)));
          if (directory in this.state.sharedCount && docs.length > this.state.sharedCount.directory) {
            this.setState({showNotification: true});
          }

          this.setState({sharedCount: {directory: docs.length}});
          this.save();
        })
        .catch(error => {
          console.log(error);
        });
    });
  }

  render() {
    const showNotification = this.state.showNotification;

    return <Notifcation showNotification={showNotification}/>
  }
}
