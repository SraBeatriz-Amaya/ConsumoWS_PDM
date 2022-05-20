import { useState } from 'react';
import { Button, FlatList, Image, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  API_PROTOCOL,
  API_BASE_URL_CITY,
  API_BASE_URL_COORD,
  API_UNITS,
  API_CNT,
  API_LANGUAGE,
  API_APPID
} from '@env'

export default function App() {
  const [cidade, setCidade] = useState('');
  const [previsao, setPrevisao] = useState({});

  const buscar = () => {
    fetch(encodeURI(`${API_PROTOCOL}://${API_BASE_URL_CITY}?units=${API_UNITS}&cnt=${API_CNT}&lang=${API_LANGUAGE}&appid=${API_APPID}&q=${cidade}`))
      .then(response => response.json())
      .then(dados => {
        let lat = dados.city.coord.lat
        let lon = dados.city.coord.lon
        fetch(encodeURI(`${API_PROTOCOL}://${API_BASE_URL_COORD}?lat=${lat}&lon=${lon}&units=${API_UNITS}&appid=${API_APPID}`))
          .then(response => response.json())
          .then(dados => {
            let previsao = {
              sunrise: dados.current.sunrise,
              sunset: dados.current.sunset,
              feelsLike: dados.current.feels_like,
              iconUrl: 'https://openweathermap.org/img/wn/' + dados.current.weather[0].icon + '.png'
            }
          
            setPrevisao(previsao);
          });
      })
  }

  return (
    <View style={styles.container}>
      <View>
        <TextInput 
          style={styles.inputCidade}
          placeholder='Digite a cidade...'
          value={cidade}
          onChangeText={setCidade}
        />

        <Button 
          title="Buscar"
          onPress={buscar}
        />
      </View>

      { previsao.sunset && (
        <View style={styles.previsao}> 
          <Image 
            style={styles.icon}
            source={{
            uri: previsao.iconUrl
            }} />
          <View>
            <Text>Nascer do Sol: {new Date(Number(previsao.sunrise * 1000)).toLocaleString()}</Text>
            <Text>Pôr do Sol: {new Date(Number(previsao.sunset * 1000)).toLocaleString()}</Text>
            <Text>Sensação Térmica: {previsao.feelsLike} {'\u00B0C'}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 40,
    maxWidth: 450,
    width: '100%',
    alignSelf: 'center'
  },
  icon: {
    width: 50,
    height: 50
  },
  inputCidade: {
    padding: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#03a1fc',
    marginBottom: 3
  },
  previsao: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#03a1fc',
    borderRadius: 4,
    marginTop: 3
  },
});
