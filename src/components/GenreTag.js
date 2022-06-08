import PropTypes from "prop-types"
import React from "react"
import LiedTag from "./LiedTag"

GenreTag.propTypes = {
  aktiv: PropTypes.bool,
  aktiveGruppeHandler: PropTypes.func.isRequired,
  checkHandler: PropTypes.func.isRequired,
  gekauft: PropTypes.bool.isRequired,
  gruppe: PropTypes.object.isRequired,
}

/**
 * Diese Komponente repräsentiert eine Artikelgruppe
 * @component
 * @property {Boolean} aktiv - setzt diese Genre als `aktiveGruppe` in der App.js
 * @property {Function} aktiveGruppeHandler - setzt diese Genre als `aktiveGruppe` in der {@link ../App}
 * @property {Function} checkHandler - erledigt und reaktiviert Lied; wird an den {@link LiedTag} durchgereicht
 * @property {Boolean} gekauft - steuert, ob diese Genre in der "Gekauft-" oder "NochZuKaufen-Liste" erscheint
 * @property {Genre} gruppe - die darzustellende Genre
 */
class GenreTag extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      aufgeklappt: true
    }
  }

  componentDidMount () {
    let aufgeklappt = localStorage.getItem("gruppe-" + this.props.gruppe.id)
    aufgeklappt = (aufgeklappt == null) ? true : JSON.parse(aufgeklappt)
    this.setState({aufgeklappt: aufgeklappt})
  }

  artikelEntfernen (name) {

    if (window.confirm("Wollen Sie diesen Eintrag wirklich löschen?!")) {
      this.props.gruppe.liedLoeschen(name)
    }
    this.props.aktiveGruppeHandler(this.props.gruppe)
  }

  aufZuKlappen () {
    const neuerZustand = !this.state.aufgeklappt
    localStorage.setItem("gruppe-" + this.props.gruppe.id, neuerZustand)
    this.setState({aufgeklappt: !this.state.aufgeklappt})
  }

  render () {
    const gruppe = this.props.gruppe

    let gruppenHeader = ""
    gruppenHeader = (
      <dt className={this.props.aktiv ? "aktiv" : "inaktiv"}
          onClick={() => this.props.aktiveGruppeHandler(gruppe)}>
        <span>{gruppe.name}</span>
        <i className="material-icons"
           onClick={() => this.aufZuKlappen()}>
          {this.state.aufgeklappt ? "expand_more" : "expand_less"}
        </i>
      </dt>)

    let artikelArray = []
    if (this.state.aufgeklappt) {
      for (const artikel of gruppe.liedListe) {
        if (artikel.geprobt === this.props.gekauft) {
          artikelArray.push(
            <LiedTag artikel={artikel} key={artikel.id}
                     checkHandler={this.props.checkHandler}
                     deleteHandler={() => this.artikelEntfernen(artikel.name)}/>)
        }
      }
    }

    return (
      <React.Fragment>
        {gruppenHeader}
        {artikelArray}
      </React.Fragment>
    )
  }
}

export default GenreTag
