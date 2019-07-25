import React from 'react';
// import logo from './logo.svg';
import './App.css';
// import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react'; // or 'aws-amplify-react-native';
import Amplify, { Auth, Storage } from 'aws-amplify';
// import { Auth } from "aws-amplify";

Amplify.configure(awsconfig);
class App extends React.Component {
  state = {
    imageName: "",
    imageFile: "",
    response: ""
  };
  onChange = () => {
    const file = this.upload.files[0]
    let reader = new FileReader();
    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result,
        height: 200,
        width: 200,
        imgSize: file.size / 1000
      });
    }
    reader.readAsDataURL(file)
  }
   uploadImage = async () => {
    Storage.configure({ level: 'private' });
    // const { identityId } = await Auth.currentCredentials();
    const { username: owner } = await Auth.currentUserInfo();
    Storage.put(
      `userimages/${owner}/${this.upload.files[0].name}`,
      this.upload.files[0],
      { contentType: this.upload.files[0].type }
    )
      .then(result => {
        this.upload = null;
        this.setState({ response: "Success uploading file!" });
      })
      .catch(err => {
        this.setState({ response: `Cannot uploading file: ${err}` });
      });
  };

  render() {
    let { imagePreviewUrl, height, width } = this.state;
    return (
      <div className="App">
        <img src={imagePreviewUrl} alt='' width={width} height={height} />
        <h2>Upload Profile Photo</h2>
        <input
          type="file"
          accept="image/png, image/jpeg"
          style={{ display: "none" }}
          ref={ref => (this.upload = ref)}
          onChange={this.onChange}
        />
        <input value={this.state.imageName} placeholder="Select file" />
        <button
          onClick={e => {
            this.upload.value = null;
            this.upload.click();
          }}
          loading={this.state.uploading}
        >
          Browse
        </button>

        <button onClick={this.uploadImage}> Upload File </button>

        {!!this.state.response && <div>{this.state.response}</div>}
      </div>
    );
  }
}

// export default App;
export default withAuthenticator(App, true);
