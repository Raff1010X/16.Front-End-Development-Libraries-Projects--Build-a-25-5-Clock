const defaultState = {
  break: 5,
  session: 25,
  timer: 1500,
  timerState: "Session",
  timerRun: false
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...defaultState
    };
    this.handleReset = this.handleReset.bind(this);
    this.handleIncreaseDecrease = this.handleIncreaseDecrease.bind(this);
    this.handleStartStop = this.handleStartStop.bind(this);
    this.handleInterval = this.handleInterval.bind(this);
    this.beepAudio = React.createRef();
  }

  handleReset() {
    this.setState({
      ...defaultState
    });
    clearInterval(this.interval);
    this.beepAudio.current.pause();
    this.beepAudio.current.currentTime = 0;
  }

  handleIncreaseDecrease(stateParam, add) {
    let newState,
      timerState = 0;
    if (add) newState = this.state[stateParam] + 1;
    else newState = this.state[stateParam] - 1;
    if (this.state.timerRun || newState < 1 || newState > 60) return;
    if (this.state.timerState.toLowerCase() == stateParam.toLowerCase())
      timerState = newState * 60;
    else timerState = this.state.timer;
    this.setState({
      [stateParam]: newState,
      timer: timerState
    });
  }

  handleStartStop() {
    if (!this.state.timerRun) {
      this.setState({
        timerRun: true
      });
      this.interval = setInterval(this.handleInterval, 1000);
    } else {
      this.setState({
        timerRun: false
      });
      clearInterval(this.interval);
    }
  }

  handleInterval() {
    if (this.state.timer === 0) {
      let newState = "Break";
      let newTimer = this.state.break * 60;
      if (this.state.timerState === "Break") {
        newState = "Session";
        newTimer = this.state.session * 60;
      }
      this.setState({
        timerState: newState,
        timer: newTimer
      });
      this.beepAudio.current.play();
      return;
    }
    this.setState((state) => ({
      timer: state.timer - 1
    }));
  }

  render() {
    return (
      <div id="app">
        <AppLabel 
          session={this.state.session}
          break={this.state.break}
          />
        <BreakLabel
          break={this.state.break}
          handleBreakDecrement={() =>
            this.handleIncreaseDecrease("break", false)
          }
          handleBreakIncrement={() =>
            this.handleIncreaseDecrease("break", true)
          }
        />
        <SesionLabel
          session={this.state.session}
          handleSessionDecrement={() =>
            this.handleIncreaseDecrease("session", false)
          }
          handleSessionIncrement={() =>
            this.handleIncreaseDecrease("session", true)
          }
        />
        <TimerLabel
          timerState={this.state.timerState}
          timer={this.state.timer}
        />
        <TimerControls
          handleReset={this.handleReset}
          handleStartStop={this.handleStartStop}
          timerRun={this.state.timerRun}
        />
        <audio
          id="beep"
          preload="auto"
          src="https://raff1010x.github.io/beep.wav"
          ref={this.beepAudio}
        />
      </div>
    );
  }
}

const AppLabel = (props) => {
  return <h1>{props.session} + {props.break} Clock</h1>;
};

const BreakLabel = (props) => {
  return (
    <div id="break-label">
      <p>Break Length</p>
      <div className="lenght-container">
        <button id="break-decrement" onClick={props.handleBreakDecrement}>
          -
        </button>
        <div id="break-length">{props.break}</div>
        <button id="break-increment" onClick={props.handleBreakIncrement}>
          +
        </button>
      </div>
    </div>
  );
};

const SesionLabel = (props) => {
  return (
    <div id="session-label">
      <p>Session Length</p>
      <div className="lenght-container">
        <button id="session-decrement" onClick={props.handleSessionDecrement}>
          -
        </button>
        <div id="session-length">{props.session}</div>
        <button id="session-increment" onClick={props.handleSessionIncrement}>
          +
        </button>
      </div>
    </div>
  );
};

const TimerLabel = (props) => {
  function mmss() {
    let minutes = Math.floor(props.timer / 60);
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    let seconds = props.timer % 60;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    return minutes + ":" + seconds;
  }
  let color = (props.timer < 60) ? "red" : "black";
  return (
    <div>
      <p id="timer-label">{props.timerState}</p>
      <p id="time-left" style={{ color: color }}>
        {mmss()}
      </p>
    </div>
  );
};

const TimerControls = (props) => {
  return (
    <div id="time-controls">
      <button id="start_stop" onClick={props.handleStartStop}>
        {props.timerRun ? "Stop" : "Start"}
      </button>
      <button id="reset" onClick={props.handleReset}>
        Reset
      </button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
