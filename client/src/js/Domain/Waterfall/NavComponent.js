import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Waterfall from './WaterfallComponent';

class NavComponent extends Component {

    constructor() {
        super(...arguments);
        this.state = {
            nav: {
                viewStyle: Waterfall.VIEW_WATERFALL
            }
        }
    };

    changeViewStyle(style, e) {
        this.props.changeViewStyle(style);
        this.setState({
            nav: {
                viewStyle: style
            }
        });
        e.stopPropagation();
    }

    changeScale(scale, e) {
        this.props.changeScale(scale);
        e.stopPropagation();
    }


    render() {
       return <div className="ui menu">
           <div className="item">
               <button onClick={this.changeViewStyle.bind(this, Waterfall.VIEW_WATERFALL)} className={`ui button ${Waterfall.VIEW_WATERFALL === this.state.nav.viewStyle ? 'active' : ''}`}>
                   <i className="fa fa-align-left"></i> Waterfall
               </button>
           </div>
           <div className="item">
               <button onClick={this.changeViewStyle.bind(this, Waterfall.VIEW_GROUPED)} className={`ui button ${Waterfall.VIEW_GROUPED === this.state.nav.viewStyle ? 'active' : ''}`}>
                   <i className="fa fa-list-alt"></i> Grouped
               </button>
           </div>
           <div className="item">
               <button onClick={this.changeScale.bind(this, 0.2)} className="ui button">
                   <i className="fa fa-search-plus"></i>
               </button>
               <button onClick={this.changeScale.bind(this, 2)} className="ui button">
                   <i className="fa fa-search-minus"></i>
               </button>
           </div>
       </div>
    }
}

NavComponent.propTypes = {
    changeViewStyle: PropTypes.func,
    changeScale: PropTypes.func
};
NavComponent.defaultProps = {
    changeViewStyle: function () {},
    changeScale: ()=>{}
}

export default NavComponent;