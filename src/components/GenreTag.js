import PropTypes from "prop-types"
import React from "react"
import LiedTag from "./LiedTag"

/**
 * Diese Komponente repräsentiert ein Genre und implementiert das JSX zur Anzeige in der App
 *
 * @component Listeneintrag (dt-Tag in dl in section) ToDo: ausformulieren
 *
 * @property {Boolean} aktiv - setzt dieses Genre als `aktivesGenre` in der App.js
 * @property {Function} aktiveGruppeHandler - setzt dieses Genre als `aktivesGenre` in der {@link ../App}
 * @property {Function} checkHandler - erledigt und reaktiviert Lied; wird an den {@link LiedTag} durchgereicht
 * @property {Boolean} gekauft - steuert, ob diese Genre in der "Gekauft-" oder "NochZuKaufen-Liste" erscheint
 * @property {Genre} gruppe - das darzustellende Genre
 */
class GenreTag extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      aufgeklappt: true
    }
  }

  /**
   * Nachdem die Komponente vollständig geladen ist, wird der State der Komponente aus dem LocalStorage geladen
   */
  componentDidMount () {
    let aufgeklappt = localStorage.getItem("genre-" + this.props.genre.id)
    aufgeklappt = (aufgeklappt == null) ? true : JSON.parse(aufgeklappt)
    this.setState({aufgeklappt: aufgeklappt})
  }

  /**
   * Diese Methode ermöglicht das Löschen eines Lieds.
   * Sie verwendet {@link Genre.liedLoeschen}.
   * Es wird eine Bestätigung mittels PopUp angefordert
   * @param {String} name - Der Name des Lieds, das gelöscht werden soll.
   */
  liedLoeschen (name) {
    if (window.confirm("Wollen Sie diesen Eintrag wirklich löschen?!")) {
      this.props.genre.liedLoeschen(name)
    }
    this.props.aktivesGenreHandler(this.props.genre)
  }

  /**
   * Die Methode ermöglicht das Auf- und Zuklappen des Genres in der Anzeige.
   * Sie schaltet dazu {@link this.state.aufgeklappt} um.
   * Dieser wird auch gleich im LocalStorage aktualisiert
   */
  aufZuKlappen () {
    const neuerZustand = !this.state.aufgeklappt
    localStorage.setItem("genre-" + this.props.genre.id, neuerZustand.toString())
    this.setState({aufgeklappt: !this.state.aufgeklappt})
  }

  render () {
    const genre = this.props.genre

    let genreHeader = (
      <dt className={this.props.aktiv ? "aktiv" : "inaktiv"}
          onClick={() => this.props.aktivesGenreHandler(genre)}>
        <span>{genre.name}</span>
        <i className="material-icons"
           onClick={() => this.aufZuKlappen()}>
          {this.state.aufgeklappt ? "expand_more" : "expand_less"}
        </i>
      </dt>)

    let liedArray = []
    if (this.state.aufgeklappt) {
      for (const lied of genre.liedListe) {
        if (lied.geprobt === this.props.geprobt) {
          liedArray.push(
            <LiedTag lied={lied} key={lied.id}
                     genre={genre}
                     checkHandler={this.props.checkHandler}
                     deleteHandler={() => this.liedLoeschen(lied.name)}/>)
        }
      }
    }

    return (
      <React.Fragment>
        {genreHeader}
        {liedArray}
      </React.Fragment>
    )
  }
}

GenreTag.propTypes = {
  aktiv: PropTypes.bool,
  aktivesGenreHandler: PropTypes.func.isRequired,
  checkHandler: PropTypes.func.isRequired,
  geprobt: PropTypes.bool.isRequired,
  genre: PropTypes.object.isRequired,
}

export default GenreTag
