import React from 'react';
import QuoteBox from './index.js';

class QuoteWrap extends React.Component {

	constructor(props) {
		super(props);
		this.passIndex = this.passIndex.bind(this);
	}

	passIndex(tickerIndex){
		this.props.deleteQuoteBox(tickerIndex);
	}

	render() {

		const passIndexFunc = this.passIndex;
		return (
			<div className="pure-g">
				{this.props.tickers.map(function(ticker, index){
					return <QuoteBox
							ticker={ticker.ticker}
							key={ticker.key}
							index={ticker.key}
							getTickerIndex={passIndexFunc}
							 />
				})}
			</div>
		);
	}
}

export default QuoteWrap;
