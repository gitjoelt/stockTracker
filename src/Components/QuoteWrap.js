import React from "react";
import QuoteBox from "./QuoteBox";

const QuoteWrap = props => {
  const deleteQuoteBoxHandler = tickerIndex => {
    props.deleteQuoteBox(tickerIndex);
  };

  return (
    <div className="pure-g">
      {props.tickers.map(ticker => {
        return (
          <QuoteBox
            ticker={ticker.ticker}
            key={ticker.key}
            index={ticker.key}
            delete={deleteQuoteBoxHandler}
          />
        );
      })}
    </div>
  );
};

export default QuoteWrap;
