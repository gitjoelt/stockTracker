import React, { Component } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimesCircle,
  faSyncAlt,
  faLongArrowAltUp,
  faLongArrowAltDown,
  faChartArea
} from "@fortawesome/free-solid-svg-icons";

class QuoteBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      price: "",
      pointgl: "",
      volume: "",
      loadMsg: "Retrieving latest price",
      loadClass: faSyncAlt,
      spin: true,
      realTime: ""
    };
  }

  refreshQuotes(ticker) {
    console.log(`Refreshing Quote: ${ticker}`);
    this.setLoadMsg();
    axios
      .get(`https://tmxapi.herokuapp.com/${ticker}`)
      .then(response => {
        if (response.data.price) {
          this.setState({
            price: response.data.price,
            volume: response.data.volume,
            pointgl: response.data.pointgl,
            percentgl: response.data.percentgl,
            loadMsg: "",
            loadClass: faSyncAlt,
            spin: false,
            realTime: this.checkRealtime(ticker)
          });
        } else {
          this.setState({
            price: "N/A",
            volume: "N/A",
            pointgl: 0,
            percentgl: 0,
            loadMsg: "",
            loadClass: faSyncAlt,
            spin: false,
            realTime: ""
          });
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({
          price: "???",
          loadMsg: "An error occured:" + error,
          loadClass: faSyncAlt,
          spin: false,
          realTime: ""
        });
      });
  }

  componentDidMount() {
    this.refreshQuotes(this.props.ticker);
    this.interval = setInterval(() => {
      this.refreshQuotes(this.props.ticker);
    }, 60000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  setLoadMsg() {
    this.setState({
      loadMsg: "",
      loadClass: faSyncAlt,
      spin: true
    });
  }

  setColor(pointgl) {
    if (pointgl > 0) {
      return "green";
    } else if (pointgl === 0 || !pointgl) {
      return "grey";
    } else {
      return "red";
    }
  }

  setArrow(pointgl) {
    if (pointgl > 0) {
      return faLongArrowAltUp;
    } else if (pointgl < 0) {
      return faLongArrowAltDown;
    }
    return "";
  }

  checkRealtime(ticker) {
    if (!ticker.includes(":")) {
      return true;
    }

    return false;
  }

  abbreviateVolume(value) {
    var newValue = value;
    if (value >= 1000) {
      var suffixes = ["", "K", "M", "B", "T"];
      var suffixNum = Math.floor(("" + value).length / 3);
      var shortValue = "";
      for (var precision = 2; precision >= 1; precision--) {
        shortValue = parseFloat(
          (suffixNum != 0
            ? value / Math.pow(1000, suffixNum)
            : value
          ).toPrecision(precision)
        );
        var dotLessShortValue = (shortValue + "").replace(
          /[^a-zA-Z 0-9]+/g,
          ""
        );
        if (dotLessShortValue.length <= 2) {
          break;
        }
      }
      if (shortValue % 1 != 0) {
        var shortNum;
        shortNum = shortValue.toFixed(1);
      }
      newValue = shortValue + suffixes[suffixNum];
    }
    return newValue;
  }

  render() {
    let displayVolume = null;
    if (this.state.volume) {
      displayVolume = (
        <h3 className="volumeDisplay">
          <FontAwesomeIcon icon={faChartArea} />{" "}
          {this.abbreviateVolume(parseInt(this.state.volume.replace(",", "")))}
        </h3>
      );
    }

    return (
      <div className="pure-u-1 pure-u-sm-1-2 pure-u-lg-1-3 pure-u-xl-1-4">
        <div className="padbox">
          <div className="quoteBox">
            <div className="pure-g quoteBoxTop">
              <div className="pure-u-1 pure-u-sm-1-2">
                <div className="quoteBoxTicker">
                  <div
                    className="control"
                    onClick={() => this.props.delete(this.props.index)}
                  >
                    <FontAwesomeIcon icon={faTimesCircle} />
                  </div>{" "}
                  <a
                    className="control tickerName"
                    href={`https://web.tmxmoney.com/quote.php?qm_symbol=${this.props.ticker}`}
                    target="_blank"
                  >
                    {this.props.ticker}
                  </a>
                </div>
              </div>

              <div className="pure-u-1 pure-u-sm-1-2">
                <div className="quoteBoxStatus">
                  <div
                    className="control"
                    onClick={() => this.refreshQuotes(this.props.ticker)}
                  >
                    <FontAwesomeIcon
                      icon={this.state.loadClass}
                      spin={this.state.spin}
                    />
                  </div>{" "}
                  {this.state.realTime ? "Realtime" : "Delayed (15min)"}
                </div>
              </div>
            </div>
            <div className="quoteBoxMain">
              <h3>
                <span className={this.setColor(this.state.pointgl)}>
                  <FontAwesomeIcon icon={this.setArrow(this.state.pointgl)} />{" "}
                </span>
                {this.state.price}{" "}
                <span className={this.setColor(this.state.pointgl)}>
                  ({this.state.percentgl}%)
                </span>
              </h3>
              {displayVolume}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default QuoteBox;
