import React from 'react';
import d3 from 'd3';

require('./utils/assign');

const merge = function(one, two) {
  return Object.assign({}, one, two);
};

export default class BarChart extends React.Component {
  static propTypes = {
    data : React.PropTypes.array.isRequired,
    width : React.PropTypes.number,
    barWidth : React.PropTypes.number,
    height : React.PropTypes.number.isRequired,
    margin : React.PropTypes.object,
    ylabel : React.PropTypes.string,
    xlabel : React.PropTypes.string
  };

  static defaultProps = { margin: {top: 0, right: 0, bottom: 0, left: 0} };

  _handleBarClick(element, id){
    if(this.props.onBarClick){
        this.props.onBarClick(element, id);
    }
  }

  _renderGraph(props){
    var margin = props.margin;
    var width = props.width;
    var height = props.height;

    var DOMNode = React.findDOMNode(this);
    var svg = d3.select(DOMNode)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    svg = svg.select('.graph')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    this._reusableGraph(props);
  }

  _reusableGraph(props){ 
    var margin = props.margin;
    var width = props.width;
    var height = props.height;

    var DOMNode = React.findDOMNode(this);
    var svg = d3.select(DOMNode)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    svg = svg.select('.graph')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    svg.selectAll('rect').remove();
      
    svg.select('.x.axis').remove();
    svg.select('.y.axis').remove();
    
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`)
      .call(this.xAxis)
      .append('text')
      .attr('x', props.width / 2)
      .attr('dy', '2.3em')
      .style('text-anchor', 'end')
      .text(props.xlabel);

    svg.append('g')
      .attr('class', 'y axis')
      .call(this.yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text(props.ylabel);

    svg.selectAll('.bar')
      .data(props.data)
      .enter().append('rect')
      .on('click', ::this._handleBarClick)
      .attr('class', 'bar')
      .attr('x', d => this.x(d.text))
      .attr('width', this.x.rangeBand())
      .attr('y', d => this.y(d.value))
      .attr('height', d => height - this.y(d.value));
  }

  _defineAxis(props){
    props.width = props.width - props.margin.left - props.margin.right;
    props.height = props.height - props.margin.top - props.margin.bottom;
    
    this.x = d3.scale.ordinal().rangeRoundBands([0, props.width], 0.1); 
    this.y = d3.scale.linear().range([props.height, 0]);

    this.x.domain(props.data.map(d => d.text));
    this.y.domain([0, d3.max(props.data, d => d.value)]);

    this.xAxis = d3.svg.axis().scale(this.x).orient('bottom');
    this.yAxis = d3.svg.axis().scale(this.y).orient('left');
  }

  _setWidth(props){
    if (typeof props.width === "undefined"){
      var numberOfBars = this.props.data.length;

      props.width = (numberOfBars * props.barWidth) + props.margin.left + props.margin.right;
    }
  }

  componentDidMount(){
    var props = merge(this.props);

    this._setWidth(props);

    this._defineAxis(props);
    this._renderGraph(props);
  }

  shouldComponentUpdate(nextProps){
    var props = merge(nextProps);

    this._setWidth(props);

    this._defineAxis(props);
    this._reusableGraph(props);
    return false;
  }

  render() {
    return (
      <svg><g className='graph'></g></svg>
    );
  }
}
