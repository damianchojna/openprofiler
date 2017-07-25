import React, {Component} from 'react';
import Event from './EventComponent';
import Nav from './NavComponent';
import _ from 'lodash';

class WaterfallComponent extends Component {

    constructor() {
        super(...arguments);
        this.state = {
            viewStyle: WaterfallComponent.VIEW_WATERFALL,
            scale: 100000
        }
    };

    changeViewStyle(style) {
        console.log(style);
        this.setState({
            viewStyle: style
        });
    }

    changeScale(scale) {
        let value = this.state.scale * scale;
        console.log(value);
        if (Infinity !== value && 1 <= value) {
            this.setState({
                scale: value
            });
        }
    }

    render() {

        let first = this.props.data[0];
        let rows = {};
        if (WaterfallComponent.VIEW_GROUPED === this.state.viewStyle) {
            for (let item of this.props.data) {
                rows[item.app] ? void 0 : rows[item.app] = [];
                rows[item.app].push(item);
            }
        }
        else if (WaterfallComponent.VIEW_WATERFALL === this.state.viewStyle) {
            rows['all'] ? void 0 : rows['all'] = [];
            rows['all'] = this.props.data;
        }

        rows = _.map(rows, (items, key)=> {
            let grupedRows = items.map((item, key)=> {
                let style = {
                    marginLeft: (item.start - first.start) / this.state.scale
                };
                return <Event scaleWidth={this.state.scale} item={item} style={style} key={key}/>;
            });
            return <div key={key} className="rows">{grupedRows}</div>
        })

        return (
            <div className="Waterfall">
                <Nav changeViewStyle={this.changeViewStyle.bind(this)} changeScale={this.changeScale.bind(this)}/>
                {rows}
            </div>
        );
    }
}

WaterfallComponent.VIEW_WATERFALL = 'waterfall';
WaterfallComponent.VIEW_GROUPED = 'grouped';

export default WaterfallComponent;