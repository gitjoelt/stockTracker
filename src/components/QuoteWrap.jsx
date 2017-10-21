import React from 'react';
import QuoteBox from './QuoteBox.jsx';

class QuoteWrap extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			tickers: this.props.tickers
		}
	}

	deleteQuoteBox = (tickerIndex) => {
		let tempTickers = this.state.tickers;
		delete tempTickers[tickerIndex];
		this.setState({
			tickers: tempTickers
		});
	}

	render() {
		
		let deleteQuoteBoxFunc = this.deleteQuoteBox;

		return (
			<div className="pure-g">
				{this.state.tickers.map(function(ticker){
					return <QuoteBox 
							ticker={ticker.ticker} 
							key={ticker.key} 
							index={ticker.key} 
							getTickerIndex={deleteQuoteBoxFunc} />
				})}
			</div>
		);
	}
}

export default QuoteWrap;