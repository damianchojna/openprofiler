import React, {Component} from 'react';
import _ from 'lodash';
import obj2Json from 'stringify-object';

class EventComponent extends Component {

    constructor() {
        super(...arguments);
        this.state = {
            expand: false
        }
    };

    onClickStrip() {
        this.setState({
            expand: !this.state.expand
        });
    }

    render() {
        let item = this.props.item;
        let startDate = new Date(item.start / 1000) ;
        let endDate = new Date(item.end / 1000);
        let width = (item.end - item.start) / this.props.scaleWidth;
        let style = {
            width: width < 1 ? 1 : width
        };
        style = Object.assign(style, this.props.style)
        return (
            <div onClick={this.onClickStrip.bind(this)} className={`Event ${_.toLower(item.app)} ${_.toLower(item.remote)}`}>
                <div className={`strip ${!_.isNull(item.res.err) ? 'err' : ''}`} style={style}>
                    &nbsp;
                </div>
                <div>
                    <span className="app">{item.app}</span><span className="remote">{item.remote}</span>
                    <span className="time ui label small">{(item.end-item.start)/1000000}s</span>
                    <span className="ui label small">{`${startDate.toLocaleTimeString()}[${_.padStart(startDate.getUTCMilliseconds(), 3, 0)}]`}-{`${endDate.toLocaleTimeString()}[${_.padStart(endDate.getUTCMilliseconds(), 3, 0)}]`}</span>
                </div>
                <div style={{display: (this.state.expand ? 'block' : 'none')}}>
                        <pre>
                            {obj2Json(item)}
                        </pre>
                </div>
            </div>
        );
    }
}

export default EventComponent;