import PropTypes from "prop-types"
import React from "react"
import Modell from "../model/Repertoire"

class GenreBearbeitenTag extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isEditing: false,
      newName: this.props.genre.name
    }
  }

  handleChange (event) {
    let genreName = event.target.value
    this.setState({newName: genreName})
  }

  genreUmbenennen (genre, event) {
    if (event && event.key !== "Enter") return
    Modell.genreUmbenennen(genre.name, this.state.newName)
    this.setState({isEditing: false})
  }

  render () {
    const genre = this.props.genre

    const viewTemplate = (
      <dt>
        <span>{genre.name}</span>
        <i className="material-icons"
           onClick={() => this.setState({isEditing: true})}>
          drive_file_rename_outline</i>
        <i className="material-icons"
           onClick={this.props.entfernenHandler}>delete</i>
      </dt>
    )
    const editTemplate = (
      <dt>
        <input type="search" value={this.state.newName} autoFocus={true}
               onChange={event => this.handleChange(event)}
               onKeyDown={event => this.genreUmbenennen(genre, event)}/>
        <i className="material-icons"
           onClick={() => this.setState({isEditing: false})}>cancel </i>
        <i className="material-icons"
           onClick={() => this.genreUmbenennen(genre)}>check_circle </i>
      </dt>
    )

    return (
      this.state.isEditing
        ? editTemplate
        : viewTemplate
    )
  }
}

GenreBearbeitenTag.propTypes = {
  genre: PropTypes.object.isRequired,
  entfernenHandler: PropTypes.func.isRequired
}

export default GenreBearbeitenTag
