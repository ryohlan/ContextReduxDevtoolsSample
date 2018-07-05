import * as React from "react";
import "./App.css";

import { Consumer, Provider } from "./CounterContext";
import {
  Consumer as Consumer2,
  Provider as Provider2
} from "./CounterContext2";

class App extends React.Component {
  public render() {
    return (
      <Provider count={10} devtools>
        <Provider2 count={-10} devtools>
          <Consumer>
            {({ count, add, remove }) => (
              <div>
                <h1>{count}</h1>
                <button onClick={add}>Add</button>
                <button onClick={remove}>Remove</button>
              </div>
            )}
          </Consumer>
          <Consumer2>
            {({ count, add, remove }) => (
              <div>
                <h1>{count}</h1>
                <button onClick={add}>Add</button>
                <button onClick={remove}>Remove</button>
              </div>
            )}
          </Consumer2>
        </Provider2>
      </Provider>
    );
  }
}

export default App;
