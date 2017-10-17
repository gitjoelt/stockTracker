import React from 'react';
import axios from 'axios';
import FontAwesome from 'react-fontawesome';

class QuoteBox extends React.Component {
	
	constructor(props){
		super(props);
		this.state = {
			price: '',
			pointgl: '',
			loadMsg: 'Retrieving latest price',
			loadClass: { name: 'refresh', spin: true }
		}
	}

	refreshQuotes(ticker){

		console.log(`Refreshing Quote: ${ticker}`);
		this.setLoadMsg();
		axios.get(`https://shoogibot.xyz/bot/tmxcustomapi.php?ticker=${ticker}`)
			 .then((response) => {

			 	if(response.data.price){
				 	this.setState({
				 		price: response.data.price,
				 		pointgl: response.data.pointgl,
				 		percentgl: response.data.percentgl,
				 		loadMsg: '',
				 		loadClass: { name: 'refresh', spin: false }
				 	});
			 	} else {
			 		this.setState({
				 		price: 'N/A',
				 		pointgl: 0,
				 		percentgl: 0,
				 		loadMsg: '',
				 		loadClass: { name: 'refresh', spin: false }
				 	});
			 	}

			 })
			 .catch((error) => {
			 	console.log(error);
			 	this.setState({
			 		price: '???',
			 		loadMsg: "An error occured:" + errors,
			 		loadClass: { name: 'refresh', spin: false }
			 	});
			 });
	}

	componentDidMount(){
		this.refreshQuotes(this.props.ticker);
		this.interval = setInterval(() => {
			this.refreshQuotes(this.props.ticker)
		}, 60000);
	}

	componentWillUnmount(){
		clearInterval(this.interval);
	}


	setLoadMsg(){
		this.setState({
			loadMsg: '',
			loadClass: { name: 'refresh', spin: true }
		});
	}

	setColor(pointgl){
		if(pointgl > 0){
			return "green";
		} else if(pointgl === 0 || !pointgl) { 
			return "grey"; 
		} else {
			return "red";
		}
	}

	setArrow(pointgl){
		if(pointgl > 0){
			return "arrow-up";
		} else if(pointgl === 0) {
			return '';
		} else { 
			return "arrow-down";
		}
	}


	render() {
		return (
		<div className="pure-u-1 pure-u-md-1-3 pure-u-lg-1-4">
		<div className="padbox">
			<div className="quoteBox">
				<div className="quoteBoxHead">
					<h3>
					<span className={this.setColor(this.state.pointgl)}>
					<FontAwesome name={this.setArrow(this.state.pointgl)} />
					</span>
					&nbsp;{this.props.ticker}&nbsp;
					<span className={this.setColor(this.state.pointgl)}>
					${this.state.price} ({this.state.percentgl}%)
					</span>
					</h3>
				</div>
				<div className="quoteBoxTools">
					<div className="control" onClick={()=> this.refreshQuotes(this.props.ticker)}>
						<FontAwesome name={this.state.loadClass.name} spin={this.state.loadClass.spin} /> {this.state.loadMsg}
					</div>
					<div className="control" onClick={()=> this.props.getTickerIndex(this.props.index)}>
						<FontAwesome name='trash' />
					</div>
				</div>
			</div>
		</div>
		</div>
		);
	}
}

export default QuoteBox;