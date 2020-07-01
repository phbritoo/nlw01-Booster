import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import "./styles.css";
import logo from "../../assets/logo.svg";
import api from "../../services/api";
import axios from "axios";

//  Sempre que cria um esta: array ou objeto: manualmente informar o tipo da variável
interface Item {
  id: number;
  title: string;
  image_url: string;
}
interface IBGEUFResponse {
  sigla: string;
}
interface IBGECityResponse {
  nome: string;
}

const CreatePoint = () => {
  //Carrega os items vindo do back - UseEffect
  const [items, setItems] = useState<Item[]>([]);
  //Logica para selecionar  os items - handleSelectItem
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // Carrega as UF'S e suas respectivas cidades para o usuário escolher - UseEffect
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  //Armazena a UF e a Cidade Selecionada - function
  const [selectedUf, setSelectedUf] = useState("0");
  const [selectedCity, setSelectedCity] = useState("0");

  //Pega a posição do MAPA
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  //Pega a posição inicial do mapa, ou seja a localização em tempo real
  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  //Pega os dados dos inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
  });

  //Redirecionar para outra pagina com o useHistory
  const history = useHistory();

  //RETORNA A POSIÇÃO INICIAL DO USUÁRIO ASSIM QUE ELE ABRIR A APLICAÇÃO
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      const { latitude, longitude } = position.coords;

      setInitialPosition([latitude, longitude]);
    });
  }, []);

  // CARREGA OS ÍCONES DOS ITEMS DO BACKEND
  useEffect(() => {
    api.get("items").then((response) => {
      console.log("@BACKEND = /ITEMS:", response.data);
      setItems(response.data);
    });
  }, []);

  //CARREGA OS ESTADOS
  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((response) => {
        console.log("@RETORNO DA API DO IBGE", response);
        const ufInitials = response.data.map((uf) => uf.sigla);

        console.log("@UFS:", ufInitials);
        setUfs(ufInitials);
      });
  }, []);

  //CARREGA as cidades SEMPRE que a UF mudar
  useEffect(() => {
    console.log("@UseEffect, mudou UF para:", selectedUf);
    if (selectedUf === "0") {
      return;
    }

    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((response) => {
        console.log("@RETORNO DA API DO IBGE", response);
        const cityNames = response.data.map((city) => city.nome);

        console.log("@CIDADES:", cityNames);
        setCities(cityNames);
      });
  }, [selectedUf]);

  //Armazena a UF selecionada - onChange={handleSelectUf}
  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    console.log("@Função handleSelectUf, pegou a UF:", event.target.value);
    const uf = event.target.value;
    setSelectedUf(uf);
  }

  //Armazena a CIDADE selecionada - onChange={handleSelectCity}
  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    console.log(
      "@Função handleSelectCity, pegou a CIDADE:",
      event.target.value
    );
    const city = event.target.value;
    setSelectedCity(city);
  }

  //Opção para selecionar uma localidade no MAPA - onClick={handleMapClick}
  function handleMapClick(event: LeafletMouseEvent) {
    console.log("Latitude:", event.latlng.lat);
    console.log("Longitude:", event.latlng.lng);
    setSelectedPosition([event.latlng.lat, event.latlng.lng]);
  }

  //Captura as informções do INPUT -  onChange={handleInputChange}
  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    // console.log(event.target.name, event.target.value);

    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  // Logica para selecionar os icones - onClick={() => handleSelectItem(item.id)}
  function handleSelectItem(id: number) {
    // Se o usuario clicou no icone que ja estava selecionado antes
    const alreadySelected = selectedItems.findIndex((item) => item === id);

    if (alreadySelected >= 0) {
      //Remove o icone ja selecionado do array
      const filteredItems = selectedItems.filter((item) => item !== id);

      setSelectedItems(filteredItems);
    } else {
      //Adiciona o noco icona nao selecionado ao array
      setSelectedItems([...selectedItems, id]);
    }
  }

  //Submeter todos os dados do Form para a API - onSubmit={handleSubmit}
  async function handleSubmit(event: FormEvent) {
    console.log("@SUBMETENDO O FORM");
    //Permanecer na mesma tela
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;

    const data = {
      name,
      email,
      whatsapp,
      uf,
      city,
      latitude,
      longitude,
      items,
    };

    console.log(data);

    await api.post("points", data);

    // alert("Ponto de coleta criado!");
    history.push("/modal");
    setTimeout(() => {
      history.push("/");
    }, 3000);
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>
      <form onSubmit={handleSubmit}>
        <h1>
          Cadastro do <br /> ponto de coleta
        </h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={selectedPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                name="uf"
                id="uf"
                value={selectedUf}
                onChange={handleSelectUf}
              >
                <option value="0">Selecione uma UF</option>
                {ufs.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                value={selectedCity}
                onChange={handleSelectCity}
              >
                <option value="0">Selecione uma cidade</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>

          <ul className="items-grid">
            {items.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSelectItem(item.id)}
                className={selectedItems.includes(item.id) ? "selected" : ""}
              >
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
};

export default CreatePoint;
