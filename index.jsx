import React, { useRef }  from 'react'
import ReactDOM from 'react-dom'
/////////////////////////////----------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\
const INIT_TIMER = 25 * 60; //----- 25 minutes
const INIT_WAKE = 5 * 60; //----- 5 minutes
const MAX_TIMER = 60 * 60; //----- 60 minutes
const MIN_TIMER = 60; //----- 1 minute
const MINUTE = 60; //------ 1  minute
const START = "START";
const STOP = "STOP";
const SESSION = "Session";
const BREAK = "Break";
const OVER_60 = "OVER-60"; //------ control color on css
const MINUS_60 = "MINUS-60"; //------ control color on css
const MINUS_30 = "MINUS-30"; //------ control color on css
const MINUS_10 = "MINUS-10"; //------ control color on css
/////////////////////////////----------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\
const AUDIO_BEEP = {
  id: "beep",
  url:
    "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
};
/////////////////////////////----------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\
const INIT_STATE = {
  timer: INIT_TIMER,
  break: INIT_WAKE,
  session: INIT_TIMER,
  intervalId: null,
  //beep: new Audio(AUDIO_BEEP.url),
  startStop: STOP,
  timerType: SESSION,
  color: OVER_60
};
/////////////////////////////----------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = INIT_STATE;
    this.handleStartStop = this.handleStartStop.bind(this);
  }
  /////////////////////////////----------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\
  componentDidUpdate(prevProps, prevState) {
    if (this.state.timer == "0") {
      this.handleBeep();
      if (prevState.timerType == SESSION) {
        setTimeout(() => {
          this.setState({
            timer: prevState.break,
            timerType: BREAK
          });
        }, 1000);
      } else if (prevState.timerType == BREAK) {
        setTimeout(() => {
          this.setState({
            timer: prevState.session,
            timerType: SESSION
          });
        }, 1000);
      }
    }
  }
  /////////////////////////////----------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\
  handleBeep = () => {
    this.audioBeep.play();
  };
  /////////////////////////////----------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\
  handleTimer = (value) => {
    if (value < 0) return "00:00";
    let minutes = Math.floor(value / 60);
    let seconds = value - minutes * 60;
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    return minutes + ":" + seconds;
  };

  handleGet = (value) => {
    if (value < 0) return "00";
    let minutes = Math.floor(value / 60);
    return minutes;
  };
  /////////////////////////////----------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\
  handleReset = () => {
    this.handleStop();
    this.setState(INIT_STATE);
    let audioElement = this.state.beep;
    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
  };

  handleStartStop = () => {
    if (this.state.startStop === STOP) {
      this.handleStart();
      this.setState({
        startStop: START
      });
    } else {
      this.handleStop();
      this.setState({
        startStop: STOP
      });
    }
  };

  handleColor = () => {
    if (this.state.timer <= "60") {
      this.setState({
        color: MINUS_60
      });
    }
    if (this.state.timer <= "30") {
      this.setState({
        color: MINUS_30
      });
    }
    if (this.state.timer <= "10") {
      this.setState({
        color: MINUS_10
      });
    }
    if (this.state.timer > "60") {
      this.setState({
        color: OVER_60
      });
    }
  };

  handleStart = () => {
    if (!this.state.intervalId) {
      const intervalId = setInterval(() => {
        this.setState((prevState) => ({
          timer: prevState.timer - 1
        }));
        this.handleColor();
      }, 1000);
      this.setState({ intervalId });
    }
  };

  handleStop = () => {
    if (this.state.intervalId) {
      clearInterval(this.state.intervalId);
      this.setState({ intervalId: null });
    }
  };
  /////////////////////////////----------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\
  handleSessionUp = () => {
    if (this.state.timer < MAX_TIMER) {
      this.setState((prevState) => ({
        timer: prevState.timer + MINUTE,
        session: prevState.timer + MINUTE
      }));
    }
  };

  handleSessionDown = () => {
    if (this.state.timer > MIN_TIMER) {
      this.setState((prevState) => ({
        timer: prevState.timer - MINUTE,
        session: prevState.timer - MINUTE
      }));
    }
  };
  /////////////////////////////----------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\
  handleBreakUp = () => {
    if (this.state.break < MAX_TIMER) {
      this.setState((prevState) => ({
        break: prevState.break + MINUTE
      }));
    }
  };

  handleBreakDown = () => {
    if (this.state.break > MIN_TIMER) {
      this.setState((prevState) => ({
        break: prevState.break - MINUTE
      }));
    }
  };
  /////////////////////////////----------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\
  render() {
    return (
      <div id="clock">
        <h1>25+5 Clock</h1>
        <div id="label-wrapper">
          <div id="session-label">
            <p>Session Length</p>
            <button
              id="session-decrement"
              className="btn btn-dark"
              onClick={this.handleSessionDown}
            >
              <i className="fa fa-arrow-down fa-2x"></i>
            </button>
            <span id="session-length">
              {this.handleGet(this.state.session)}
            </span>
            <button
              id="session-increment"
              className="btn btn-dark"
              onClick={this.handleSessionUp}
            >
              <i className="fa fa-arrow-up fa-2x"></i>
            </button>
          </div>
          <div id="break-label">
            <p>Break Length</p>
            <button
              id="break-decrement"
              className="btn btn-dark"
              onClick={this.handleBreakDown}
            >
              <i className="fa fa-arrow-down fa-2x"></i>
            </button>
            <span id="break-length">{this.handleGet(this.state.break)}</span>
            <button
              id="break-increment"
              className="btn btn-dark"
              onClick={this.handleBreakUp}
            >
              <i className="fa fa-arrow-up fa-2x"></i>
            </button>
          </div>
        </div>
        <div id="timer">
          <div id="timer-wrapper">
            <div id="timer-label" className={this.state.color}>
              <h3>{this.state.timerType}</h3>
            </div>
            <h2 id="time-left" className={this.state.color}>
              {this.handleTimer(this.state.timer)}
            </h2>
            <audio
              id={AUDIO_BEEP.id}
              src={AUDIO_BEEP.url}
              preload="auto"
              ref={(audio) => {
                this.audioBeep = audio;
              }}
            />
          </div>
          <div id="controls">
            <button
              id="start_stop"
              className="btn btn-outline-danger"
              onClick={this.handleStartStop}
            >
              <i className="fas fa fa-solid fa-pause fa-2x"></i>
            </button>
            <button
              id="start_stop"
              className="btn btn-outline-primary btn-lg"
              onClick={this.handleStartStop}
            >
              <i className="fas fa fa-solid fa-play fa-2x"></i>
            </button>
            <button
              id="reset"
              className="btn btn-outline-warning"
              onClick={this.handleReset}
            >
              <i className="fa fa-refresh fa-2x"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const MyApp = <App />;
  ReactDOM.render(MyApp, document.getElementById("wrapper"));
});
