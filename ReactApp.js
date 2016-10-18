var React = require('react'),
    DOM = React.DOM, div = DOM.div, button = DOM.button, ul = DOM.ul, li = DOM.li, a = DOM.a, h1 = DOM.h1

// This is just a simple example of a component that can be rendered on both
// the server and browser

module.exports = React.createClass({

  // We initialise its state by using the `props` that were passed in when it
  // was first rendered. We also want the button to be disabled until the
  // component has fully mounted on the DOM
  getInitialState: function() {
    return {items: this.props.items, user: this.props.user}
  },

  // Once the component has been mounted, we can enable the button
  componentDidMount: function() {
    this.setState({disabled: false})
  },

  // Then we just update the state whenever its clicked by adding a new item to
  // the list - but you could imagine this being updated with the results of
  // AJAX calls, etc
  handleClick: function() {
    this.setState({
      items: this.state.items.concat('Item ' + this.state.items.length)
    })
  },

  // For ease of illustration, we just use the React JS methods directly
  // (no JSX compilation needed)
  render: function() {
    if (this.state.user) {
      return div(null,
        h1(null, this.state.user.name),
        a({href: '/logout'}, 'Logout'),
        ul({children: this.state.items.map(function(item) {
          return li(null, item)
        })})
      )
    }

    return div(null,
      a({href: '/auth/google'}, 'Sign in with Google'),
      ul({children: this.state.items.map(function(item) {
        return li(null, item)
      })})

    )
  },
})