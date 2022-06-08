import Lied from "./Lied.js"
import Modell from "./Repertoire.js"

/**
 * Repräsentiert das Genre der Lieder
 * Klasse zum Gruppieren der Lieder
 *
 * @property {Number}    counter      - dient zur Erzeugung eindeutiger Gruppen-IDs
 * @property {Number}    id           - eindeutige ID-Nummer der Genre
 * @property {Number}    index        - Position der Genres innerhalb der Gruppenliste
 * @property {String}    name         - Name der Genre
 * @property {Lied[]} liedListe        - Liste der Lieder in diesem Genre
 */
class Genre {
  static counter = 1
  id
  index
  name
  liedListe

  constructor (name, index) {
    this.id = Genre.counter++
    this.name = name
    this.index = index
    this.liedListe = []
  }

  /**
   * Sucht ein Lied anhand seines Namens
   * @param {String} suchName - Name des gesuchten Artikels
   * @param {Boolean} meldungAusgeben - steuert, ob eine Meldung ausgegeben wird
   * @returns {Lied|null} lied - das gefundene Lied bzw. `null`, wenn nichts gefunden wurde
   */
  liedFinden (suchName, meldungAusgeben = true) {
    for (let lied of this.liedListe) {
      if (lied.name === suchName) {
        return lied
      }
    }
    if (meldungAusgeben) {
      Modell.informieren("[" + this.name + "] Lied " + suchName + " nicht gefunden", true)
    }
    return null
  }

  /**
   *
   * Listet die Lieder in diesem Genre in der Konsole auf
   * Nur zum Debugging
   *
   * @param {Boolean} gekauft - steuert die Anzeige der gekauften oder noch zu kaufenden Lied
   */

  /*
  artikelAuflisten (geprobt) {
    for (let artikel of this.liedListe) {
      if (artikel.geprobt === geprobt) {
        console.debug("  " + artikel.name)
      }
    }
  }
  */

  /**
   * Fügt ein Lied zur Liederliste hinzu und gibt dieses als Wert zurück
   * @param {String} name - Name des neuen Lieds
   * @returns {Lied} neuesLied - das neu erzeugte Lied
   */
  liedHinzufuegen (name) {
    let vorhandenesLied = this.liedFinden(name, false)
    if (!vorhandenesLied) {
      let neuesLied = new Lied(name, this.liedListe.length)
      this.liedListe.push(neuesLied)
      Modell.informieren("[" + this.name + "] Lied " + name + " hinzugefügt")
      return neuesLied
    } else {
      Modell.informieren("[" + this.name + "] Lied " + name + " existiert schon!", true)
    }
  }

  /**
   * Erzeugt ein neues Lied aus einem eingelesenen JSON-Objekt.
   * Wird von {@link Modell.initialisieren()} verwendet.
   * @param {object} lied - das übergebene JSON-Objekt
   */
  liedAusJSONHinzufuegen (lied) {
    let neuesLied = this.liedHinzufuegen(lied.name)
    // kopiert alle Properties aus "lied" nach "neuesLied"
    Object.assign(neuesLied, lied)
  }

  /**
   * Löscht ein Lied aus der Liederliste
   * @param {String} name - Name des zu löschenden Lieds
   */
  liedLoeschen (name) {
    let loeschLied = this.liedFinden(name)
    if (loeschLied) {
      const index = this.liedListe.indexOf(loeschLied)
      this.liedListe.splice(index, 1)
      this.indizesNeuNummerieren()
      Modell.informieren("[" + this.name + "] Lied \"" + name + "\" entfernt")
    } else {
      Modell.informieren("[" + this.name + "] Lied \"" + name + "\" konnte NICHT entfernt werden", true)
    }
  }

  /**
   * Nummeriert alle Lieder in der Liederliste neu durch
   */
  indizesNeuNummerieren () {
    for (let i = 0; i < this.liedListe.length; i++) {
      this.liedListe[i].index = i
    }
  }

  /**
   * Sucht einen Lied anhand des Namens und benennt ihn um.
   *
   * wird in Zukunft verwendet werden. Aktuell wird {@link LiedTag.liedUmbenennen} verwendet
   *
   * @param {String} alterName - Name des zu findenden Lieds
   * @param {String} neuerName - neuer Name des Lieds
   */
  liedUmbenennen (alterName, neuerName) {
    let vorhandenerArtikel = this.liedFinden(alterName)
    if (vorhandenerArtikel) {
      vorhandenerArtikel.name = neuerName
    }
    Modell.informieren("[" + this.name + "] Lied \"" + alterName + "\" umbenannt in \"" + neuerName + "\"")
  }
}

export default Genre
