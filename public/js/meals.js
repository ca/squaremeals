var Meal = React.createClass({
  replaceMeal: function () {
    console.log('Replace Meal');
  },
  render: function () {
    return(
      <div id="meal1" className="meal_card">
        <h1 className="meal_header">
          <span className="bold">Meal {this.props.meal.mealNumber}</span>&middot; {this.props.meal.mealTime}
        </h1>
        <article className="meal front">
          <div className="thumb" style="width: 150px; height: 150px;"></div>
          <h2>{this.props.meal.name}</h2>
          <div className="mealInfo">  
            <div className="numbers">
              <p>{this.props.meal.kilocalories}</p>
              <p>{this.props.meal.protein}</p>
              <p>{this.props.meal.carbs}</p>
              <p>{this.props.meal.fat}</p>
            </div>
            <div>
              <p> Kilocalories </p>
              <p> Protein </p>
              <p> Carbs </p>
              <p> Fat </p>
            </div>
          </div>
          <div className="meal_button"> Select Meal </div>
          <div className="meal_button bottom" onClick={this.replaceMeal()}> I Don't Like This </div>
        </article>
      </div>
    );
  }
});

var MealList = React.createClass({
  render: function () {
    var meals = this.props.data.map(function (meal) {
      return(
        <Meal meal={meal} />
      )
    });
    return(
      <div id="meals" />
    );
  }
});

ReactDOM.render(
  <MealList url="/api/comments" pollInterval={2000} />,
  document.getElementById('today')
);