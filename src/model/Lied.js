/**
 * Klasse zur Repräsentation eines Lieds
 *
 * @property {Number}  counter - dient zur Erzeugung eindeutiger Lied-IDs
 * @property {Number}  id      - eindeutige ID-Nummer des Artikels
 * @property {Number}  index   - Position des Artikels innerhalb der Liederliste
 * @property {String}  name    - Name des Artikels
 * @property {Boolean} geprobt - merkt sich, ob das Lied bereits geprobt wurde
 */
class Lied {
  static counter = 1
  id
  index
  name
  geprobt

  constructor (name, index) {
    this.id = Lied.counter++
    this.name = name
    this.index = index
    this.geprobt = false
  }
}

export default Lied
