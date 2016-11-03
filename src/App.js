import React from 'react';
import './stylesheets/main.scss';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		console.log('testing source map');
		return <h1>blah blaga</h1>;
	}
}

App.propTypes = {};
App.defaultProps = {};

export default App;
