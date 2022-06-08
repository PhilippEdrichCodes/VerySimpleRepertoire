import React from "react"
import GenreDialog from "./components/GenreDialog"
import GenreTag from "./components/GenreTag"
import SortierDialog from "./components/SortierDialog"
import Modell from "./model/Repertoire"

/**
 * @version 0.1 - 20220608
 * @author Philipp Edrich <philipp@edrich.codes>
 * @description Diese App ist eine Einkaufsliste mit React.js und separatem Model, welche Offline verwendet werden kann
 * @license Gnu Public Lesser License 3.0
 *
 */
class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      aktivesGenre: null,
      showGruppenDialog: false,
      showSortierenDialog: false,
      imSetAufgeklappt: true,
      geprobtAufgeklappt: false
    }
  }

  /**
   * Nachdem diese Komponente vollständig erstellt ist,
   * lädt sie den gespeicherten Zustand aus dem LocalStorage
   * und stellt den Anzeigezustand wieder her
   */
  componentDidMount () {
    Modell.laden()
    // Auf-/Zu-Klapp-Zustand aus dem LocalStorage laden
    let imSetIstAufgeklappt = localStorage.getItem("imSetAufgeklappt")
    imSetIstAufgeklappt = (imSetIstAufgeklappt == null) ? true : JSON.parse(imSetIstAufgeklappt)

    let geprobtIstAufgeklappt = localStorage.getItem("geprobtAufgeklappt")
    geprobtIstAufgeklappt = (geprobtIstAufgeklappt == null) ? false : JSON.parse(geprobtIstAufgeklappt)

    this.setState({
      aktivesGenre: Modell.aktivesGenre,
      imSetAufgeklappt: imSetIstAufgeklappt,
      geprobtAufgeklappt: geprobtIstAufgeklappt
    })
  }

  /**
   * Setzt den Anzeigestatus der Set-Liste.
   * Dreht dazu {@link this.state.imSetAufgeklappt} um,
   * speichert diesen Zustand im LocalStorage und
   * aktualisiert den State in (@link this.state)
   */
  imSetAufZuKlappen () {
    const neuerZustand = !this.state.imSetAufgeklappt
    localStorage.setItem("imSetAufgeklappt", neuerZustand.toString())
    this.setState({imSetAufgeklappt: neuerZustand})
  }

  /**
   * Setzt den Anzeigestatus der Geprobt-Liste.
   * Dreht dazu {@link this.state.geprobtAufgeklappt} um,
   * speichert diesen Zustand im LocalStorage und
   * aktualisiert den State in (@link this.state)
   */
  geprobtAufZuKlappen () {
    const neuerZustand = !this.state.geprobtAufgeklappt
    localStorage.setItem("geprobtAufgeklappt", neuerZustand.toString())
    this.setState({erledigtAufgeklappt: neuerZustand})
  }

  /**
   * Ermöglicht es, den localStorage vollständig zu löschen.
   * Fordert eine doppelte Bestätigung mittels PopUps ein.
   */
  lsLoeschen () {
    if (window.confirm("Wollen Sie wirklich alles löschen?!")) {
      if (window.confirm("Dies kann nicht rückgängig gemacht werden! \n" +
        " Wirklich sicher, dass sie alles löschen wollen?")) {
        localStorage.clear()
      }
    }
  }

  /**
   * Schiebt ein Lied vom Set in Geprobt oder umgekehrt.
   * Dreht dazu den Zustand von {@link Lied.geprobt} um.
   * @param {Lied} lied - das aktuelle Lied, das gerade abgehakt oder reaktiviert wird
   */
  liedChecken = (lied) => {
    lied.geprobt = !lied.geprobt
    const aktion = (lied.geprobt) ? "aus dem Set genommen" : "ins Set aufgenommen"
    Modell.informieren("[App] Lied \"" + lied.name + "\" wurde " + aktion)
    this.setState(this.state)
  }

  /**
   * Fügt ein neues Lied dem aktiven Genre in der Set-Liste hinzu.
   * Verwendet dazu {@link Modell.aktivesGenre.liedHinzufuegen}.
   * Den Namen des neuen Lieds holt sich die Methode aus dem Eingabefeld im Header.
   * Anschließend leert die Methode dieses Feld und setzt den Focus darauf,
   * sodass direkt ein weiteres Lied hinzugefügt werden kann
   */
  liedHinzufuegen () {
    const eingabe = document.getElementById("artikelEingabe")
    const artikelName = eingabe.value.trim()
    if (artikelName.length > 0) {
      Modell.aktivesGenre.liedHinzufuegen(artikelName)
      this.setState(this.state)
    }
    eingabe.value = ""
    eingabe.focus()
  }

  /**
   * Setzt das übergebene Genre als aktives (zu bearbeitendes) Genre.
   * Speichert dies mittels {@link Modell.informieren} und
   * aktualisiert den State in {@link this.state}
   * @param genre
   */
  setAktivesGenre (genre) {
    Modell.aktivesGenre = genre
    Modell.informieren("[App] Genre \"" + genre.name + "\" ist nun aktiv")
    this.setState({aktiveGruppe: Modell.aktivesGenre})
  }

  /**
   * Sortiert die Listen in der übergebenen Reihenfolge,
   * wenn der Vorgang nicht abgebrochen wurde.
   * Wird vom closeHandler des SortierDialog aufgerufen.
   * Wenn der Dialog mittels "Abbrechen" geschlossen wurde,
   * ist der Parameter sortieren false und die Methode sortiert nicht
   * @param {String} reihenfolge - Die gewünschte Sortierung
   * @param {boolean} sortieren - Steuert, ob sortiert wird oder nicht.
   */
  closeSortierDialog = (reihenfolge, sortieren) => {
    if (sortieren) {
      Modell.sortieren(reihenfolge)
    }
    this.setState({showSortierDialog: false})
  }

  render () {
    let nochZuKaufen = []
    if (this.state.imSetAufgeklappt === true) {
      for (const gruppe of Modell.genreListe) {
        nochZuKaufen.push(
          <GenreTag
            key={gruppe.id}
            aktiv={gruppe === this.state.aktivesGenre}
            aktivesGenreHandler={() => this.setAktivesGenre(gruppe)}
            checkHandler={this.liedChecken}
            geprobt={false}
            genre={gruppe}
          />)
      }
    }

    let schonGekauft = []
    if (this.state.geprobtAufgeklappt) {
      for (const gruppe of Modell.genreListe) {
        schonGekauft.push(
          <GenreTag
            key={gruppe.id}
            aktiv={gruppe === this.state.aktivesGenre}
            aktivesGenreHandler={() => this.setAktivesGenre(gruppe)}
            checkHandler={this.liedChecken}
            geprobt={true}
            genre={gruppe}
          />)
      }
    }

    let gruppenDialog = ""
    if (this.state.showGruppenDialog) {
      gruppenDialog = <GenreDialog
        genreListe={Modell.genreListe}
        onDialogClose={() => this.setState({showGruppenDialog: false})}/>
    }

    let sortierDialog = ""
    if (this.state.showSortierenDialog) {
      sortierDialog = <SortierDialog onDialogClose={this.closeSortierDialog}/>
    }

    return (
      <div id="container">
        <header>
          <h1>Repertoire</h1>
          <label id="add"
                 className="mdc-text-field mdc-text-field--filled mdc-text-field--with-trailing-icon mdc-text-field--no-label">
            <span className="mdc-text-field__ripple"></span>
            <input className="mdc-text-field__input"
                   type="search"
                   id="artikelEingabe"
                   placeholder="Lied hinzufügen"
                   onKeyDown={e => (e.key === "Enter") ? this.liedHinzufuegen() : ""}/>
            <span className="mdc-line-ripple"></span>
            <i className="material-icons mdc-text-field__icon mdc-text-field__icon--trailing"
               tabIndex="0" role="button"
               onClick={() => this.liedHinzufuegen()}>add_circle</i>
          </label>

        </header>
        <hr/>

        <main>
          <section>
            <h2>Im Set
              <i onClick={() => this.imSetAufZuKlappen()} className="material-icons">
                {this.state.imSetAufgeklappt ? "expand_more" : "expand_less"}
              </i>
            </h2>
            <dl>
              {nochZuKaufen}
            </dl>
          </section>
          <hr/>
          <section>
            <h2>Aktiv
              <i onClick={() => this.geprobtAufZuKlappen()} className="material-icons">
                {this.state.geprobtAufgeklappt ? "expand_more" : "expand_less"}
              </i>
            </h2>
            <dl>
              {schonGekauft}
            </dl>
          </section>
        </main>
        <hr/>

        <footer>
          <button id="genreButton"
                  className="mdc-button mdc-button--raised"
                  onClick={() => this.setState({showGruppenDialog: true})}>
            <span className="material-icons">bookmark_add</span>
            <span className="mdc-button__ripple"></span> Genre
          </button>
          <button id="sortButton" className="mdc-button mdc-button--raised"
                  onClick={() => this.setState({showSortierDialog: true})}>
            <span className="material-icons">sort</span>
            <span className="mdc-button__ripple"></span> Sort
          </button>
          <button id="clearButton" className="mdc-button mdc-button--raised"
                  onClick={this.lsLoeschen}>
            <span className="material-icons">clear_all</span>
            <span className="mdc-button__ripple"></span> Clear
          </button>
        </footer>

        {gruppenDialog}
        {sortierDialog}
      </div>
    )
  }
}

export default App
