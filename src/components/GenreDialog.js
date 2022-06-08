import React from "react"
import Modell from "../model/Repertoire"
import GenreBearbeitenTag from "./GenreBearbeitenTag"

class GenreDialog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      genreListe: this.props.genreListe
    }
  }

  /**
   * Diese Methode fügt der Genre-Liste einen neuen Eintrag hinzu.
   * Sie nutzt dazu {@link Modell.genreHinzufuegen}.
   * Den Namen des neuen Genres holt sich die Methode aus dem Eingabefeld.
   */
  genreHinzufuegen () {
    let eingabe = document.getElementById("eingabe")
    let genreName = eingabe.value.trim()
    if (genreName.length > 0) {
      Modell.genreHinzufuegen(genreName)
      this.setState({genreListe: Modell.genreListe})
    }
    eingabe.value = ""
    eingabe.focus()
  }

  /**
   * Die Methode löscht einen Eintrag aus der Genre-Liste.
   * Sie nutzt dazu {@link Modell.genreLoeschen}.
   * Es wird eine Bestätigung mittels PopUp angefordert.
   * @param {String} name - der Name des zu löschenden Genre
   */
  genreLoeschen (name) {
    if (window.confirm("Wollen Sie diesen Eintrag wirklich löschen?!")) {
      Modell.genreLoeschen(name)
    }
    this.setState({gruppenListe: Modell.genreListe})
  }

  render () {
    const genreListe = []
    for (let genre of this.state.genreListe) {
      genreListe.push(<GenreBearbeitenTag
        key={genre.id}
        genre={genre}
        entfernenHandler={() => this.genreLoeschen(genre.name)}/>)
    }

    return (<div className="mdc-dialog mdc-dialog--open popup">
      <div className="mdc-dialog__container">
        <div className="mdc-dialog__surface"
             role="alertdialog"
             aria-modal="true"
             aria-labelledby="my-dialog-title"
             aria-describedby="my-dialog-content">
          <h2 className="mdc-dialog__title" id="my-dialog-title">Genres bearbeiten</h2>

          <div className="mdc-dialog__content"
               id="my-dialog-content">
            <label
              className="mdc-text-field mdc-text-field--filled mdc-text-field--with-trailing-icon mdc-text-field--no-label">
              <span className="mdc-text-field__ripple"></span>
              <input className="mdc-text-field__input"
                     type="search"
                     id="eingabe"
                     placeholder="Genre hinzufügen"
                     autoComplete="false"
                     onKeyDown={e => (e.key === "Enter") ? this.genreHinzufuegen() : ""}/>
              <span className="mdc-line-ripple"></span>
              <i className="material-icons mdc-text-field__icon mdc-text-field__icon--trailing"
                 tabIndex="0"
                 role="button"
                 onClick={() => this.genreHinzufuegen()}>add_circle</i>
            </label>

            <dl className="mdc-deprecated-list">
              {genreListe}
            </dl>
          </div>
          <div className="mdc-dialog__actions">
            <button type="button"
                    className="mdc-button mdc-dialog__button"
                    onClick={this.props.onDialogClose}>
              <div className="mdc-button__ripple"></div>
              <span className="mdc-button__label">Schließen</span>
            </button>
          </div>
        </div>
      </div>
      <div className="mdc-dialog__scrim"></div>
    </div>)
  }
}

export default GenreDialog
