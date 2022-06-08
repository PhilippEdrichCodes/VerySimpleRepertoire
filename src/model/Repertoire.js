import Genre from "./Genre.js"

/**
 * Diese Klasse steuert das Modell der App
 *
 * @property {Genre[]} gruppenListe      - enthält die Artikelgruppen
 * @property {Genre}   aktiveGruppe      - enthält die aktuell ausgewählte Genre
 * @property {boolean}  meldungenAusgeben - steuert, ob eine Meldung ausgegeben werden soll oder nicht
 */
class Repertoire {
  genreListe = []
  aktivesGenre = null
  meldungenAusgeben = true
  SORTIERUNGEN = {
    "Eigene Reihenfolge": this.sortiereIndex,
    "Aufsteigend": this.sortiereAufsteigend,
    "Absteigend": this.sortiereAbsteigend
  }
  sortierung = Object.keys(this.SORTIERUNGEN)[0]
  STORAGE_KEY = "repertoireDaten"

  /**
   * Sucht eine Genre nach ihrem Namen und liefert sie als Objekt zurück
   * @param {String} suchName - Name der gesuchten Genre
   * @param {Boolean} meldungAusgeben - steuert, ob eine Meldung ausgegeben wird
   * @returns {Genre | null} gefundeneGruppe - die gefundene Genre; `null`, wenn nichts gefunden wurde
   */
  gruppeFinden (suchName, meldungAusgeben = false) {
    for (let gruppe of this.genreListe) {
      if (gruppe.name === suchName) {
        return gruppe
      }
    }
    // nichts gefunden, meldung ausgeben
    if (meldungAusgeben) {
      this.informieren("[App] Genre \"" + suchName + "\" nicht gefunden", true)
    }
    return null
  }

  /**
   * Fügt eine Genre in der Gruppenliste hinzu
   * @param {String} name - Name der neuen Genre
   * @returns {Genre} neueGruppe - die neu hinzugefügte Genre
   */
  gruppeHinzufuegen (name) {
    let vorhandeneGruppe = this.gruppeFinden(name)
    if (!vorhandeneGruppe) {
      let neueGruppe = new Genre(name, this.genreListe.length)
      this.genreListe.push(neueGruppe)
      this.informieren("[App] Genre \"" + name + "\" hinzugefügt")
      return neueGruppe
    } else {
      this.informieren("[App] Genre \"" + name + "\" existiert schon!", true)
    }
  }

  /**
   * Entfernt die Genre mit dem `name`
   * @param {String} name - Name der zu löschenden Genre
   */
  gruppeEntfernen (name) {
    let loeschGruppe = this.gruppeFinden(name)
    if (loeschGruppe) {
      let index = this.genreListe.indexOf(loeschGruppe)
      this.genreListe.splice(index, 1)
      this.informieren("[App] Genre \"" + name + "\" entfernt"
      )
    } else {
      this.informieren("[App] Genre \"" + name + "\" konnte NICHT entfernt werden!", true)
    }
  }

  /**
   * Benennt die Genre `alterName` um
   * @param {String} alterName - Name der umzubenennenden Genre
   * @param {String} neuerName - der neue Name der Genre
   */
  gruppeUmbenennen (alterName, neuerName) {
    let suchGruppe = this.gruppeFinden(alterName, true)
    if (suchGruppe) {
      suchGruppe.name = neuerName
      this.informieren("[App] Genre \"" + alterName + "\" umbenannt in \"" + neuerName + "\"")
    }
  }

  /**
   * For Debugging only
   *
   * Gibt die Gruppen mit Artikeln auf der Konsole aus
   */

  /* allesAuflisten () {
    console.debug("Einkaufsliste")
    console.debug("--------------------")
    for (const genre of this.genreListe) {
      console.debug("[" + genre.name + "]")
      genre.artikelAuflisten(false)
    }
  } */

  /**
   * Gibt eine Meldung aus und speichert den aktuellen Zustand im LocalStorage
   * @param {String} nachricht - die auszugebende Nachricht
   * @param {boolean} istWarnung - steuert, ob die {@link nachricht} als Warnung ausgegeben wird
   */
  informieren (nachricht, istWarnung = false) {
    if (this.meldungenAusgeben) {
      if (istWarnung) {
        console.log(nachricht)
      } else {
        console.debug(nachricht)
        this.speichern()
      }
    }
  }

  /**
   * Sortiert Gruppen und Lied nach der übergebenen `reihenfolge`
   * @param {String} reihenfolge - entspricht einem der Keys aus {@link SORTIERUNGEN}
   */
  sortieren (reihenfolge) {
    this.sortierung = reihenfolge
    const sortierFunktion = this.SORTIERUNGEN[reihenfolge]
    // sortiere zuerst die Gruppen
    this.genreListe.sort(sortierFunktion)

    // sortiere danach die Lied jeder Genre
    for (let gruppe of this.genreListe) {
      gruppe.liedListe.sort(sortierFunktion)
    }
    this.informieren("[App] nach \"" + reihenfolge + "\" sortiert")
  }

  /**
   * Sortiert Elemente alphabetisch aufsteigend nach dem Namen
   * @param {Genre|Lied} a - erstes Element
   * @param {Genre|Lied} b - zweites Element
   * @returns {Number} - wenn kleiner: -1, wenn gleich: 0, wenn größer: +1
   */
  sortiereAufsteigend (a, b) {
    const nameA = a.name.toLowerCase()
    const nameB = b.name.toLowerCase()
    return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0)
  }

  /**
   * Sortiert Elemente alphabetisch absteigend nach dem Namen
   * @param {Genre|Lied} a - erstes Element
   * @param {Genre|Lied} b - zweites Element
   * @returns {Number} - wenn kleiner: -1, wenn gleich: 0, wenn größer: +1
   */
  sortiereAbsteigend (a, b) {
    const nameA = a.name.toLowerCase()
    const nameB = b.name.toLowerCase()
    return nameA < nameB ? 1 : (nameA > nameB ? -1 : 0)
  }

  /**
   * Sortiert Elemente aufsteigend nach dem ursprünglichen Index
   * @param {Genre|Lied} a - erstes Element
   * @param {Genre|Lied} b - zweites Element
   * @returns {Number} - wenn kleiner: -1, wenn gleich: 0, wenn größer: +1
   */
  sortiereIndex (a, b) {
    return a.index < b.index ? -1 : (a.index > b.index ? 1 : 0)
  }

  /**
   * Speichert den Modell-Zustand im LocalStorage
   * @param {Object} daten - entspricht dem Auf-Zuklapp-Zustand der App
   */
  speichern (daten = this) {
    const json = {
      gruppenListe: this.genreListe,
      aktiveGruppeName: this.aktivesGenre?.name,
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(json))
  }

  /**
   * Lädt den Modell-Zustand aus dem LocalStorage
   * @return {Boolean} erfolg - meldet, ob die Daten erfolgreich gelesen wurden
   */
  laden () {
    const daten = localStorage.getItem(this.STORAGE_KEY)
    if (daten) {
      this.initialisieren(JSON.parse(daten))
      this.informieren("[App] Daten aus dem LocalStorage geladen")
      return true
    }
    return false
  }

  /**
   * Initialisiert das Modell aus dem LocalStorage
   * @param {Object} jsonDaten - die übergebenen JSON-Daten
   */
  initialisieren (jsonDaten) {
    this.genreListe = []
    for (let gruppe of jsonDaten.genreListe) {
      let neueGruppe = this.gruppeHinzufuegen(gruppe.name)
      for (let artikel of gruppe.liedListe) {
        neueGruppe.liedAusJSONHinzufuegen(artikel)
      }
    }
    if (jsonDaten.aktiveGruppeName) {
      this.aktivesGenre = this.gruppeFinden(jsonDaten.aktiveGruppeName)
    }
  }
}

const Modell = new Repertoire()

export default Modell
