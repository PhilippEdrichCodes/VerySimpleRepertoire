import PropTypes from "prop-types"
import React from "react"

/**
 * Diese Komponente repräsentiert ein Lied und implementiert das JSX zur Anzeige in der App
 *
 * @component Listeneintrag (dd-Tag in dl in section) ToDo: ausformulieren
 * @property {Lied} lied -
 * @property {Genre} genre -
 * @property {Function} checkHandler - der Event-Handler fürs Abhaken und Reaktivieren, durchgereicht über GenreTag aus der App
 * @property {Function} deleteHandler - der Event-Handler fürs Löschen des Eintrags
 */
class LiedTag extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      // schaltet den Edit-Mode um
      isEditing: false,
      // enthält den neuen Namen im Edit-Mode
      newName: this.props.lied.name
    }
  }

  /**
   * Reagiert auf Änderungen im Eingabefeld und speichert den neuen Wert in this.state.newName
   * @param {Event.CHANGE} event - das Change-Event im Eingabefeld
   */
  handleChange (event) {
    this.setState({newName: event.target.value})

  }

  /**
   * Benennt ein Lied um
   * @param {Lied} lied - der umzubenennende Lied
   * @param {Event.KEYDOWN} event - das auslösende Event
   */
  artikelUmbenennen (lied, event) {
    if (event && event.key !== "Enter") return
    // ToDo: Modell.aktuelleGruppe.liedUmbenennen() verwenden
    lied.name = this.state.newName
    this.setState({isEditing: false})
  }

  render () {
    const lied = this.props.lied
    let liedName = lied.name
    if (lied.geprobt) {
      liedName = lied.name
    }

    // erlaubt das abhaken und reaktivieren
    const viewTemplate = (
      <dd>
        <label>
          <input type="checkbox" checked={lied.geprobt}
                 onChange={() => this.props.checkHandler(lied)}/>
          {liedName}
        </label>
        {!lied.geprobt ?
          <i className="material-icons"
             onClick={() => this.setState({isEditing: true})}>edit</i>
          : ""
        }
        <i className="material-icons"
           onClick={this.props.deleteHandler}>delete</i></dd>
    )

    // erlaubt das Ändern des Namens
    let editTemplate = (
      <dd>
        <input type="search" value={this.state.newName} autoFocus={true}
               onChange={event => this.handleChange(event)}
               onKeyDown={event => this.artikelUmbenennen(lied, event)}/>
        <i className="material-icons"
           onClick={() => this.setState({isEditing: false})}>cancel </i>
        <i className="material-icons"
           onClick={event => this.artikelUmbenennen(lied, event)}>check_circle </i>
      </dd>
    )

    return (
      this.state.isEditing
        ? editTemplate
        : viewTemplate
    )
  }
}

LiedTag.propTypes = {
  lied: PropTypes.object.isRequired,
  genre: PropTypes.object.isRequired,
  checkHandler: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
}

export default LiedTag
