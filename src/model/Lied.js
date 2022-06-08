/**
 * Klasse zum Beschreiben eines Artikels
 *
 * @property {Number}  counter - dient zur Erzeugung eindeutiger Lied-IDs
 * @property {Number}  id      - eindeutige ID-Nummer des Artikels
 * @property {Number}  index   - Position des Artikels innerhalb der Artikelliste
 * @property {String}  name    - Name des Artikels
 * @property {Boolean} gekauft - merkt sich, ob der Lied bereits gekauft wurde
 */
class Lied {
  static counter = 1
  id
  index
  name
  gekauft

  constructor (name, index) {
    this.id = Lied.counter++
    this.name = name
    this.index = index
    this.gekauft = false
  }
}

export default Lied
