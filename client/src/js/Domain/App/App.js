import React, {Component} from 'react';
import Waterfall from '../Waterfall/WaterfallComponent';
import obj2Json from 'stringify-object';
import _ from 'lodash';

class App extends Component {

    constructor() {
        super(...arguments);
        this.state = {
            wsData: []
        };
        this.ws = new WebSocket('ws://' + window.location.host);
    };

    componentDidMount() {
        this.ws.onopen = function () {
            console.log('OPEN')
        };

        this.ws.onclose = ()=> {
            console.log('CLOSE');
        };

        this.ws.onmessage = (e) => {
            console.log(e);
            let wsData = this.state.wsData;
            let data = JSON.parse(e.data);
            if (!data.app) {
                return;
            }
            wsData.push(data);
            wsData.sort((a, b) => {
                return a.start - b.start
            });
            this.setState({
                wsData: wsData
            });
        };
    }

    render() {
        return (
            <Waterfall data={this.state.wsData}/>
        );
    }
}

export default App;