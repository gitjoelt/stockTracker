import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import './css/pure.css';
import './css/pure-responsive.css';
import './css/style.css';


function Application() {
	return (
		<div className="bodyWrap">
			<AddTickerForm />	
		</div>
		);
}


function QuoteWrap(props) {
	return (
		<div className="pure-g">
			{props.tickers.map(function(ticker){
				return <QuoteBox ticker={ticker.ticker} key={ticker.key} />
			})}
		</div>
	);
}

class AddTickerForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			tickerTextbox: '',
			tickers: [],
			errorClass: 'errorHeader hide',
			textboxValue: 'Add Ticker'
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	isValidTicker(ticker, callback){

		this.setState({
			textboxValue: 'Looking up ' + ticker,
			errorClass: 'errorHeader hide'
		})

		axios.get(`https://shoogibot.xyz/bot/tmxcustomapi.php?ticker=${ticker}`)
			 .then((response) => {
			 	if(response.data.price){
			 		callback(true);
			 	} else { callback(false); }
			 })
			 .catch((error) => {
			 	return callback(false);
			 });
			 
	}

	handleChange(event) {
		this.setState({
			tickerTextbox: event.target.value.toUpperCase()
		});
	}

	handleSubmit(event) {

		this.isValidTicker(this.state.tickerTextbox, (isValid) => {
			if(isValid){
				let tickerArr = this.state.tickers;
				tickerArr.push({
					ticker: this.state.tickerTextbox,
					key: tickerArr.length
				});
				this.setState({
					tickers: tickerArr,
					textboxValue: 'Add Ticker'
				});
			} else {
				this.setState({
				errorClass: 'errorHeader show',
				textboxValue: 'Add Ticker'
				});
			}
		});
			
		event.preventDefault();
	}
	
	render() {
		return (
			<div>
				<div className={this.state.errorClass}>
					<i className="fa fa-exclamation-triangle" aria-hidden="true"></i> Couldn't find ticker
				</div>
				<div className="header">
					<div className="add-ticker-form">
						<form onSubmit={this.handleSubmit}>
						<input className="tickerTextbox" type="text" placeholder="Enter a ticker (TSX Only)"
						 value={this.state.tickerTextbox} onChange={this.handleChange} />
						<input type="submit" className="tickerSubmit" value={this.state.textboxValue} />
						</form>
					</div>
				</div>
				<QuoteWrap tickers={this.state.tickers} />
			</div>
		);
	}
}

class QuoteBox extends React.Component {
	
	constructor(props){
		super(props);
		this.state = {
			price: '',
			pointgl: '',
			loadMsg: 'Retrieving latest price',
			loadClass: 'fa fa-refresh fa-spin'
		}
	}

	refreshQuotes(ticker){

		console.log("interval");
		this.setLoadMsg();
		axios.get(`https://shoogibot.xyz/bot/tmxcustomapi.php?ticker=${ticker}`)
			 .then((response) => {

			 	if(response.data.price){
				 	this.setState({
				 		price: response.data.price,
				 		pointgl: response.data.pointgl,
				 		loadMsg: '',
				 		loadClass: 'fa fa-refresh'
				 	});
			 	} else {
			 		this.setState({
				 		price: 'N/A',
				 		pointgl: 0,
				 		loadMsg: '',
				 		loadClass: 'fa fa-refresh'
				 	});
			 	}

			 })
			 .catch((error) => {
			 	console.log(error);
			 	this.setState({
			 		price: '???',
			 		loadMsg: "An error occured:" + errors,
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

	deleteComponent(){
		let mountNode = React.findDOMNode(this.refs.wassup);
    	let unmount = React.unmountComponentAtNode(mountNode);
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
			return "fa fa-caret-up";
		} else if(pointgl === 0) {
			return '';
		} else { 
			return "fa fa-caret-down";
		}
	}


	render() {
		return (
		<div className="pure-u-1 pure-u-md-1-3 pure-u-lg-1-4">
		<div className="padbox">
			<div className="quoteBox">
				<div className="quoteBoxHead">
					<h3>{this.props.ticker} <span className={this.setColor(this.state.pointgl)}>${this.state.price}
					&nbsp;<i className={this.setArrow(this.state.pointgl)} aria-hidden="true"></i></span></h3>
				</div>
				<div className="quoteBoxTools">
					<div className="control" onClick={()=> this.refreshQuotes(this.props.ticker)}><i className={this.state.loadClass} 
					aria-hidden="true"></i> {this.state.loadMsg}</div>
					<div className="control"><i className="fa fa-trash" aria-hidden="true"></i></div>
				</div>
			</div>
		</div>
		</div>
		);
	}
}


ReactDOM.render(<Application />, document.getElementById('App'));