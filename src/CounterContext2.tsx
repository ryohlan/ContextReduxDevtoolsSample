import * as React from "react";

interface Props {
  children: any;
  count: number;
  devtools: boolean;
}

export interface State {
  count: number;
  add: () => void;
  remove: () => void;
}

const defaultProps: State = {
  count: 0,
  add: () => undefined,
  remove: () => undefined
};

const Context = React.createContext(defaultProps);

export const Consumer = Context.Consumer;

const reduxDevtoolsExtension =
  typeof window !== "undefined" && (window as any).__REDUX_DEVTOOLS_EXTENSION__;

export class Provider extends React.Component<Props, State> {
  devtools: any;
  state: State = {
    count: this.props.count,
    add: () =>
      this.setState(
        ({ count }) => ({ count: count + 1 }),
        () => {
          if (this.devtools) {
            const devtoolsType = "ADD_COUNT";
            this.devtools.send(devtoolsType, this.state);
          }
        }
      ),
    remove: () =>
      this.setState(
        ({ count }) => ({ count: count - 1 }),
        () => {
          if (this.devtools) {
            const devtoolsType = "REMOVE_COUNT";
            this.devtools.send(devtoolsType, this.state);
          }
        }
      )
  };

  constructor(props: Props) {
    super(props);

    if (this.props.devtools && reduxDevtoolsExtension) {
      this.devtools = reduxDevtoolsExtension.connect({ name: "TodosContext2" });
      this.devtools.init(this.state);
      this.devtools.subscribe((message: any) => {
        console.log(message);
        if (message.type === "DISPATCH" && message.state) {
          this.setState(JSON.parse(message.state));
        }

        if (message.type === "ACTION" && message.payload) {
          const parse = JSON.parse(message.payload);
          this.state[parse.type](parse.payload);
        }
      });
    }
  }

  componentWillUnmount() {
    if (this.devtools) {
      this.devtools.unsubscribe();
      reduxDevtoolsExtension.disconnect();
    }
  }

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}
