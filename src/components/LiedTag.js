import React from "react"

class LiedTag extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      // schaltet den Edit-Mode um
      isEditing: false,
      // enthält den neuen Namen im Edit-Mode
      newName: this.props.artikel.name
    }
  }

  /**
   * Reagiert auf Änderungen im Eingabefeld und speichert den neuen Wert im newName-state
   * @param {Event.CHANGE} event - das Change-Event im Eingabefeld
   */
  handleChange (event) {
    this.setState({newName: event.target.value})
  }

  /**
   * Benennt ein Lied um
   * @param {Lied} artikel - der umzubenennende Lied
   * @param {Event.KEYDOWN} event - das auslösende Event
   */
  artikelUmbenennen (artikel, event) {
    if (event && event.key !== "Enter") return
    // ToDo: Modell.aktuelleGruppe.artikelUmbenennen() verwenden
    artikel.name = this.state.newName
    this.setState({isEditing: false})
  }

  render () {
    const artikel = this.props.artikel
    let artikelName = artikel.name
    if (artikel.geprobt) {
      artikelName = <s>{artikel.name}</s>
    }

    // erlaubt das abhaken und reaktivieren
    const viewTemplate = (
      <dd>
        <label>
          <input type="checkbox" checked={artikel.geprobt}
                 onChange={() => this.props.checkHandler(artikel)}/>
          {artikelName}
        </label>
        {!artikel.geprobt ?
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
               onKeyDown={event => this.artikelUmbenennen(artikel, event)}/>
        <i className="material-icons"
           onClick={() => this.setState({isEditing: false})}>cancel </i>
        <i className="material-icons"
           onClick={event => this.artikelUmbenennen(artikel, event)}>check_circle </i>
      </dd>
    )

    return (
      this.state.isEditing
        ? editTemplate
        : viewTemplate
    )
  }
}

export default LiedTag
