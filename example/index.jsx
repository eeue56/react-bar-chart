var data = [
  {text: 'Man', value: 500}, 
  {text: 'Woman', value: 300} 
];

var margin = {top: 20, right: 20, bottom: 30, left: 40};

var Index = React.createClass({
  getInitialState: function() {
    return {
      width: 500 
    };
  },

  componentDidMount: function () {
    var _this = this;
    var domNode = this.getDOMNode();

    window.onresize = function(){
     _this.setState({width: domNode.offsetWidth}); 
    };
  },

  handleBarClick(element, id){ 
    console.log('The bin ' + element.text + ' with id ' + id + ' was clicked');
  },

  render: function() {
    return (
        <div>
            <div style={{width: '50%'}}> 
                <BarChart ylabel='Quantity' xlabel="Gender" barWidth={300} height={500} margin={margin} data={data} onBarClick={this.handleBarClick}/>
            </div>
            <div style={{width: '50%'}}> 
                <BarChart ylabel='Quantity' width={500} height={500} margin={margin} data={data} onBarClick={this.handleBarClick}/>
            </div>
        </div>
    );
  }
});

React.render(
  <Index />,
  document.getElementById('container')
);
