import React from "react";
import QuoteBox from "./QuoteBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimesCircle,
  faSyncAlt,
  faLongArrowAltUp,
  faLongArrowAltDown,
  faChartArea,
} from "@fortawesome/free-solid-svg-icons";

const QuoteWrap = (props) => {

  const deleteQuoteBoxHandler = (tickerIndex) => {
    props.deleteQuoteBox(tickerIndex);
  };

  return (
    <section className="cb-table-section">
      <div className="cb-div">
        <table className="cb-table">
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th>Name</th>
              <th>Price</th>
              <th>Currency</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {props.tickers.map((ticker) => {
              return (
                <QuoteBox
                  ticker={ticker.ticker}
                  key={ticker.key}
                  index={ticker.key}
                  delete={deleteQuoteBoxHandler}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default QuoteWrap;
