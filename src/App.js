import React, { Component } from "react";
import axios from "axios";
import QuoteWrap from "./Components/QuoteWrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faQuestionCircle,
  faChartLine
} from "@fortawesome/free-solid-svg-icons";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tickerTextbox: { value: "", readOnly: false, style: "tickerInput" },
      tickers: localStorage.getItem("LS_tickers")
        ? JSON.parse(localStorage.getItem("LS_tickers"))
        : [],
      errorClass: "errorHeader hide",
      buttonText: "Add Ticker",
      exampleTickers: ["WEED", "AMD:US", "LVI:CNX", "RHT"],
      exampleTickerIndex: 0
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteQuoteBox = this.deleteQuoteBox.bind(this);
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({
        exampleTickerIndex: this.refreshExampleTickers(
          this.state.exampleTickerIndex
        )
      });
    }, 3000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  editLocalStorage(tickerArr, isDelete) {
    localStorage.setItem("LS_tickers", JSON.stringify(tickerArr));
    //if all the tickers have been deleted then set lscount back to zero
    if (tickerArr.length <= 0) {
      localStorage.setItem("LS_count", 0);
    }
    //not deleting so add to the count
    if (!isDelete) {
      let count = localStorage.getItem("LS_count");
      count++;
      localStorage.setItem("LS_count", count);
    }
  }

  refreshExampleTickers(index) {
    const length = this.state.exampleTickers.length - 1;
    if (index === length) {
      clearInterval(this.interval);
    } else {
      index += 1;
    }

    return index;
  }

  isValidTicker(ticker, callback) {
    this.setState({
      tickerTextbox: {
        value: this.state.tickerTextbox.value,
        readOnly: true,
        style: "tickerInput tickerInputLoading"
      },
      buttonText: "Looking up " + ticker,
      errorClass: "errorHeader hide"
    });

    axios
      .get(`https://shoogibot.xyz/bot/tmxcustomapi.php?ticker=${ticker}`)
      .then(response => {
        if (response.data.price) {
          callback(true);
        } else {
          callback(false);
        }
      })
      .catch(error => {
        return callback(false);
      });
  }

  handleChange(event) {
    this.setState({
      tickerTextbox: {
        value: event.target.value.toUpperCase(),
        readOnly: false,
        style: "tickerInput"
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.isValidTicker(this.state.tickerTextbox.value, isValid => {
      if (isValid) {
        let tickerArr = this.state.tickers;
        tickerArr.push({
          ticker: this.state.tickerTextbox.value,
          key: localStorage.getItem("LS_count")
            ? localStorage.getItem("LS_count")
            : 0
        });
        tickerArr.sort(this.sortTickersAlpha);
        this.editLocalStorage(tickerArr, false);
        this.setState({
          tickerTextbox: { value: "", readOnly: false, style: "tickerInput" },
          tickers: tickerArr,
          buttonText: "Add Ticker"
        });
      } else {
        this.setState({
          tickerTextbox: {
            value: this.state.tickerTextbox.value,
            readOnly: false,
            style: "tickerInput"
          },
          errorClass: "errorHeader show",
          buttonText: "Add Ticker"
        });
      }
    });
  }

  sortTickersAlpha(a, b) {
    if (a.ticker === b.ticker) {
      return 0;
    } else {
      return a.ticker < b.ticker ? -1 : 1;
    }
  }

  deleteQuoteBox(tickerIndex) {
    this.setState(
      {
        tickers: this.state.tickers.filter(ticker => tickerIndex !== ticker.key)
      },
      () => {
        this.editLocalStorage(this.state.tickers, true);
      }
    );
  }

  render() {
    return (
      <div>
        <div className={this.state.errorClass}>
          <FontAwesomeIcon icon={faExclamationTriangle} />{" "}
          {"Couldn't find ticker"}
        </div>
        <div className="logoheading">
          <h1>
            <FontAwesomeIcon icon={faChartLine} /> Stock Tracker
          </h1>
        </div>
        <div className="header">
          <div className="input-area">
            <div className="pure-g">
              <div className="pure-u-1 pure-u-sm-1-2">
                <div className="padbox-left">
                  <form onSubmit={this.handleSubmit}>
                    <input
                      className={this.state.tickerTextbox.style}
                      type="text"
                      placeholder={
                        "Enter a ticker (ex. " +
                        this.state.exampleTickers[
                          this.state.exampleTickerIndex
                        ] +
                        ")"
                      }
                      value={this.state.tickerTextbox.value}
                      onChange={this.handleChange}
                      readOnly={this.state.tickerTextbox.readOnly}
                    />

                    <input
                      type="submit"
                      className="tickerSubmit"
                      value={this.state.buttonText}
                    />
                  </form>
                </div>
              </div>
              <div className="pure-u-1 pure-u-sm-1-2">
                <div className="padbox-right">
                  <div className="infobox">
                    <FontAwesomeIcon icon={faQuestionCircle} />{" "}
                    <strong>Formatting Help</strong>
                    <ul>
                      <li>
                        US Stocks must end with <strong>:US</strong> (ex. AMD:US
                        / AAPL:US)
                      </li>
                      <li>
                        CSE Stocks must end with <strong>:CNX</strong> (ex.
                        LVI:CNX)
                      </li>
                      <li>
                        Only companies listed on the TSXV are real time quotes
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <QuoteWrap
          tickers={this.state.tickers}
          deleteQuoteBox={this.deleteQuoteBox}
        />
      </div>
    );
  }
}

export default App;
