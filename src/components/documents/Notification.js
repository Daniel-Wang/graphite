import React, { Component } from "react";
import { ToastContainer, toast } from 'react-toastify';

class Notification extends Component {
  toastId = null;

  notify = () => {
    if (this.props.showNotification && !toast.isActive(this.toastId)) {
      this.toastId = toast("I cannot be duplicated! You've got a new shared doc");
    }
  };

  render() {
    return (this.notify());
  }
}
