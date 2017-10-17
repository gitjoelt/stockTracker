import React from 'react';
import axios from 'axios';
import FontAwesome from 'react-fontawesome';
import QuoteWrap from './QuoteWrap.jsx';

class AddTickerForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			tickerTextbox: { value: '', disabled: false },
			tickers: [],
			errorClass: 'errorHeader hide',
			buttonText: 'Add Ticker'
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	isValidTicker(ticker, callback){

		this.setState({
			tickerTextbox: { value: this.state.tickerTextbox.value, disabled: true },
			buttonText: 'Looking up ' + ticker,
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
			tickerTextbox: { value: event.target.value.toUpperCase(), disabled: false }
		});
	}

	handleSubmit(event) {

		this.isValidTicker(this.state.tickerTextbox.value, (isValid) => {
			if(isValid){
				let tickerArr = this.state.tickers;
				tickerArr.push({
					ticker: this.state.tickerTextbox.value,
					key: tickerArr.length
				});
				this.setState({
					tickerTextbox: { value: '', disabled: false },
					tickers: tickerArr,
					buttonText: 'Add Ticker'
				});
			} else {
				this.setState({
					tickerTextbox: { value: this.state.tickerTextbox.value, disabled: false },
					errorClass: 'errorHeader show',
					buttonText: 'Add Ticker'
				});
			}
		});
			
		event.preventDefault();
	}
	
	render() {
		return (
			<div>
				<div className={this.state.errorClass}>
					<FontAwesome name='exclamation-triangle' /> Couldn't find ticker
				</div>
				<div className="header">
					<div className="add-ticker-form">
						<form onSubmit={this.handleSubmit}>
						<input 
						className="tickerTextbox" 
						type="text" 
						placeholder="Enter a ticker (TSX Only)"
						value={this.state.tickerTextbox.value} 
						onChange={this.handleChange} 
						disabled={this.state.tickerTextbox.disabled} />
						<input type="submit" className="tickerSubmit" value={this.state.buttonText} />
						</form>
					</div>
				</div>
				<QuoteWrap tickers={this.state.tickers} />
			</div>
		);
	}
}

export default AddTickerForm;