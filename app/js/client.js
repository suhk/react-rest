const React = require('react');
const ReactDOM = require('react-dom');

var People = React.createClass({
  getInitialState: function() {
    return {
      people: [],
    };
  },

  loadFromServer: function() {
    $.get(this.props.url, function (result) {
      this.setState({
        people: result
      });
    }.bind(this));
  },

  componentDidMount: function() {
    $.get(this.props.url, function (result) {
      this.setState({
        people: result
      });
    }.bind(this));
  },

  handleNewPerson: function(person) {
    $.ajax({
      contentType: 'application/json',
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: JSON.stringify(person),
      success: function(result) {
        this.setState({data: this.state.people.concat([result])});
        this.loadFromServer();
      }.bind(this)
    });
  },

  handleEdit: function(person) {
    $.ajax({
      contentType: 'application/json',
      url: this.props.url + '/' + person.person._id,
      type: 'PUT',
      data: JSON.stringify(person.person),
      success: function(result) {
        this.loadFromServer();
      }.bind(this)
    });
  },

  handleDelete: function(person) {
    $.ajax({
      contentType: 'application/json',
      url: this.props.url + '/' + person.person._id,
      type: 'DELETE',
      success: function(result) {
        this.loadFromServer();
      }.bind(this)
    });
  },

  render: function() {
    return (
      <div>
        <ul>
          {this.state.people.map(function(person) {
            return (
              <li key={person._id}>
                {person._id}
                <EditPerson person={person} onDelete={this.handleDelete} onEdit={this.handleEdit} />
              </li>
            )
          }.bind(this))}
        </ul>
        <NewPerson onCommentSubmit={this.handleNewPerson} />
      </div>
    );
  }
});

var EditPerson = React.createClass({
  getInitialState: function() {
    return {
      name: this.props.person.name
    };
  },

  handleNameChange: function(e) {
    this.setState({name: e.target.value});
  },

  handleClick: function(e) {
    e.preventDefault();
    this.props.onDelete({person: this.props.person});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    this.props.person.name = this.state.name;
    this.props.onEdit({person: this.props.person});
  },

  render: function() {
    return (
      <div>
        <button onClick={this.handleClick}>Delete Person</button>
        <form className="test">
          <input type="text" value={this.state.name} onChange={this.handleNameChange} />
          <input onClick={this.handleSubmit} type="submit" value="Update" />
        </form>
      </div>
    )
  }
});

var NewPerson = React.createClass({
  getInitialState: function() {
    return {
      name: '',
    };
  },

  handleNameChange: function(e) {
    this.setState({name: e.target.value});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var n = this.state.name.trim();
    if(!n) return;
    this.props.onCommentSubmit({name: n});
    this.setState({name: ''});
  },

  render: function() {
    return (
      <form className="newForm" onSubmit={this.handleSubmit}>
        <input name="name" type="text" value={this.state.name} placeholder="Name" onChange={this.handleNameChange} />
        <input name="submit" type="submit" value="POST" />
      </form>
    )
  }
});

ReactDOM.render(<People url="http://localhost:3000/api/person" />, document.getElementById('get'));
