import React, { Component } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExternalLinkAlt,
  faSyncAlt,
  faLongArrowAltUp,
  faLongArrowAltDown,
  faBolt,
  faExclamationTriangle,
  faTrash
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
      .get(`https://shoogibot.xyz/bot/tmxcustomapi.php?ticker=${ticker}`)
      .then(response => {
        if (response.data.price) {
          this.setState({
            price: "$" + response.data.price,
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

  render() {
    return (
      <div className="pure-u-1 pure-u-sm-1-2 pure-u-lg-1-3 pure-u-xl-1-4">
        <div className="padbox">
          <div className="quoteBox">
            <div className="quoteBoxHead">
              <h3>
                <span className={this.setColor(this.state.pointgl)}>
                  <FontAwesomeIcon icon={this.setArrow(this.state.pointgl)} />
                </span>
                &nbsp;{this.props.ticker}&nbsp;
                <span className={this.setColor(this.state.pointgl)}>
                  {this.state.price} ({this.state.percentgl}%)
                </span>
              </h3>
            </div>

            <div className="quoteBoxVol">
              {"Volume: "}
              <span className="volume">{this.state.volume}</span>
            </div>

            <div className="pure-g">
              <div className="pure-u-1 pure-u-md-1-2">
                <div className="quoteBoxTools">
                  <div
                    className="control"
                    onClick={() => this.refreshQuotes(this.props.ticker)}
                  >
                    <FontAwesomeIcon
                      icon={this.state.loadClass}
                      spin={this.state.spin}
                    />{" "}
                    {this.state.loadMsg}
                  </div>
                  <div
                    className="control"
                    onClick={() => this.props.delete(this.props.index)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </div>
                  <div className="control">
                    <a
                      href={`https://web.tmxmoney.com/quote.php?qm_symbol=${this.props.ticker}`}
                      target="_blank"
                    >
                      <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="pure-u-1 pure-u-md-1-2">
                <div className="quoteBoxInfo">
                  <FontAwesomeIcon
                    icon={this.state.realTime ? faBolt : faExclamationTriangle}
                  />
                  &nbsp;
                  {this.state.realTime ? "Realtime" : "Delayed (15min)"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default QuoteBox;
