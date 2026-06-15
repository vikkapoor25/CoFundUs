import React, { Component } from 'react';
import tableau from 'tableau-api';

class TableauReact extends Component {

componentDidMount() {
    this.initViz();
}

initViz() {
const vizUrl = 'https://public.tableau.com/views/Quickproject/ChangebySub-Industry2?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link';
const vizContainer = this.vizContainer;
const options = {
width: this.vizContainer.offsetWidth,
height: this.vizContainer.offsetHeight,
};
let viz = new window.tableau.Viz(vizContainer, vizUrl, options);
}

render() {
return (
<div className='vizDiv' ref={(div) => { this.vizContainer = div }}>
</div>
)
}
}



export default TableauReact;
