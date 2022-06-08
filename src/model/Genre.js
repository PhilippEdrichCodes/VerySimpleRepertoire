import Lied from "./Lied.js"
import Modell from "./Repertoire.js"

/**
 * Klasse zum Gruppieren der Lieder
 *
 * @property {Number}    counter      - dient zur Erzeugung eindeutiger Gruppen-IDs
 * @property {Number}    id           - eindeutige ID-Nummer der Genre
 * @property {Number}    index        - Position der Genres innerhalb der Gruppenliste
 * @property {String}    name         - Name der Genre
 * @property {Lied[]} artikelListe - Liste der Lieder in diesem Genre
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
  artikelAuflisten (gekauft) {
    for (let artikel of this.liedListe) {
      if (artikel.gekauft === gekauft) {
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
   * Erzeugt einen neuen Lied aus einem eingelesenen JSON-Objekt.
   * Wird von {@link Modell.initialisieren()} verwendet.
   * @param {object} artikel - das übergebene JSON-Objekt
   */
  artikelObjektHinzufuegen (artikel) {
    let neuerArtikel = this.liedHinzufuegen(artikel.name)
    // kopiert alle Properties aus "artikel" nach "neuerArtikel"
    Object.assign(neuerArtikel, artikel)
  }

  /**
   * Entfernt einen Lied aus der ArtikelListe
   * @param {String} name - Index des zu entfernenden Artikels
   */
  artikelEntfernen (name) {
    let loeschArtikel = this.liedFinden(name)
    if (loeschArtikel) {
      const index = this.liedListe.indexOf(loeschArtikel)
      this.liedListe.splice(index, 1)
      this.artikelNeuNummerieren()
      Modell.informieren("[" + this.name + "] Lied \"" + name + "\" entfernt")
    } else {
      Modell.informieren("[" + this.name + "] Lied \"" + name + "\" konnte NICHT entfernt werden", true)
    }
  }

  /**
   * Nummeriert alle Lied in der Lied-Liste neu durch
   */
  artikelNeuNummerieren () {
    for (let i = 0; i < this.liedListe.length; i++) {
      this.liedListe[i].index = i
    }
  }

  /**
   * Sucht einen Lied anhand des Namens und benennt ihn um.
   * @param {String} alterName - Name des zu findenden Artikels
   * @param {String} neuerName - neuer Name des Artikels
   */
  artikelUmbenennen (alterName, neuerName) {
    let vorhandenerArtikel = this.liedFinden(alterName)
    if (vorhandenerArtikel) {
      vorhandenerArtikel.name = neuerName
    }
    Modell.informieren("[" + this.name + "] Lied \"" + alterName + "\" umbenannt in \"" + neuerName + "\"")
  }
}

export default Genre
