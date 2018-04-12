import React from 'react';
import axios from 'axios';

class QuoteBox extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			price: '',
			pointgl: '',
			volume: '',
			loadMsg: 'Retrieving latest price',
			loadClass: 'fa fa-refresh fa-spin'
		}
	}


	refreshQuotes(ticker){

		console.log(`Refreshing Quote: ${ticker}`);
		this.setLoadMsg();
		axios.get(`https://shoogibot.xyz/bot/tmxcustomapi.php?ticker=${ticker}`)
			 .then((response) => {

			 	if(response.data.price){
				 	this.setState({
				 		price: '$' + response.data.price,
				 		volume: response.data.volume,
				 		pointgl: response.data.pointgl,
				 		percentgl: response.data.percentgl,
				 		loadMsg: '',
				 		loadClass: 'fa fa-refresh'
				 	});
			 	} else {
			 		this.setState({
				 		price: 'N/A',
				 		volume: 'N/A',
				 		pointgl: 0,
				 		percentgl: 0,
				 		loadMsg: '',
				 		loadClass: 'fa fa-refresh'
				 	});
			 	}

			 })
			 .catch((error) => {
			 	console.log(error);
			 	this.setState({
			 		price: '???',
			 		loadMsg: "An error occured:" + error,
			 		loadClass: 'fa fa-refresh'
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
			loadClass: 'fa fa-refresh fa-spin'
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
			return "fa fa-arrow-up";
		} else if(pointgl < 0) {
			return "fa fa-arrow-down";
		}
		return '';
	}


	render() {
		return (
		<div className="pure-u-1 pure-u-md-1-3 pure-u-lg-1-4">
		<div className="padbox">
			<div className="quoteBox">
				<div className="quoteBoxHead">
					<h3>
					<span className={this.setColor(this.state.pointgl)}>
						<i className={this.setArrow(this.state.pointgl)}></i>
					</span>
					&nbsp;{this.props.ticker}&nbsp;
					<span className={this.setColor(this.state.pointgl)}>
					{this.state.price} ({this.state.percentgl}%)
					</span>
					</h3>
				</div>
				<div className="quoteBoxVol">
				{'Volume: '}<span className="volume">{this.state.volume}</span>
				</div>
				<div className="quoteBoxTools">
					<div className="control" onClick={()=> this.refreshQuotes(this.props.ticker)}>
						<i className={this.state.loadClass}></i> {this.state.loadMsg}
					</div>
					<div className="control"
						onClick={()=> this.props.getTickerIndex(this.props.index)}>
						<i className="fa fa-trash"></i>
					</div>
					<div className="control">
						<a href={`https://web.tmxmoney.com/quote.php?qm_symbol=${this.props.ticker}`} target="_blank">
							<i className="fa fa-external-link"></i>
						</a>
					</div>
				</div>
			</div>
		</div>
		</div>
		);
	}
}

export default QuoteBox;
