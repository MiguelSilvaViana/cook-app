import { useEffect } from 'react';
import { useState } from 'react';
import { ScrollView, Text, View, Alert } from 'react-native';
import { router } from 'expo-router';

import { services } from '@/services';

import { Selected } from '@/components/Selected';
import { Ingredient } from '@/components/Ingredient';

import { styles } from './styles';

export default function Index() {
  const [selected, setSelected] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<IngredientResponse[]>([]);

  function handleToggleIngredient(value: string) {
    if (selected.includes(value)) {
      return setSelected((state) => state.filter((item) => item !== value));
    }

    setSelected((state) => [...state, value]);
    console.log(selected);
  }

  function handleClearSelected() {
    Alert.alert('limpar', 'Deseja limpar tudo?', [
      { text: 'Não', style: 'cancel' },
      { text: 'Sim', onPress: () => setSelected([]) },
    ]);
  }

  function handleSearch() {
    router.navigate('/recipes/' + selected);
  }

  useEffect(() => {
    // services.ingredients.findAll().then((data) => setIngredients(data)) isso abaixo é a mesma coisa q isso em cima;
    services.ingredients.findAll().then(setIngredients);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Escolha{'\n'}
        <Text style={styles.subtitle}>os produtos</Text>
      </Text>

      <Text style={styles.message}>
        Descubra receitas baseadas no produtos que você escolheu.
      </Text>

      <ScrollView
        contentContainerStyle={styles.ingredient}
        showsVerticalScrollIndicator={false}
      >
        {ingredients.map((item) => (
          <Ingredient
            key={item.id}
            name={item.name}
            image={`${services.storage.imagePath}/${item.image}`}
            selected={selected.includes(String(item.id))}
            onPress={() => {
              handleToggleIngredient(String(item.id));
            }}
          />
        ))}
      </ScrollView>

      {selected.length > 0 && (
        <Selected
          quantity={selected.length}
          onClear={handleClearSelected}
          onSearch={handleSearch}
        />
      )}
    </View>
  );
}
