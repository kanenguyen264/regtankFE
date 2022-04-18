import Nprogress from "nprogress";
import "nprogress/nprogress.css";
import React, { Component } from "react";
import ReactPlaceholder from "react-placeholder";
import "react-placeholder/lib/reactPlaceholder.css";

export default function asyncComponent(importComponent) {
  class AsyncFunc extends Component {
    constructor(props) {
      super(props);
      this.state = {
        component: null
      };
    }

    UNSAFE_componentWillMount() {
      Nprogress.start();
    }

    componentWillUnmount() {
      this.mounted = false;
    }

    async componentDidMount() {
      this.mounted = true;
      const { default: ComponentRender } = await importComponent();
      Nprogress.done();
      if (this.mounted) {
        this.setState({
          component: <ComponentRender {...this.props} />
        });
      }
    }

    render() {
      const ComponentRender = this.state.component || (
        <div className="loader-view" style={{ height: "calc(100vh - 200px)" }}>
        </div>
      );
      return (
        <ReactPlaceholder type="text" rows={7} ready={ComponentRender !== null}>
          {ComponentRender}
        </ReactPlaceholder>
      );
    }
  }

  return AsyncFunc;
}
