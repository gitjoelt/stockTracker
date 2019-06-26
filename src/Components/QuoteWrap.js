import React, { Component } from "react";
import QuoteBox from "./QuoteBox";

class QuoteWrap extends Component {
  constructor(props) {
    super(props);
  }

  deleteQuoteBoxHandler = tickerIndex => {
    this.props.deleteQuoteBox(tickerIndex);
  };

  render() {
    return (
      <div className="pure-g">
        {this.props.tickers.map(ticker => {
          return (
            <QuoteBox
              ticker={ticker.ticker}
              key={ticker.key}
              index={ticker.key}
              delete={this.deleteQuoteBoxHandler}
            />
          );
        })}
      </div>
    );
  }
}

export default QuoteWrap;
