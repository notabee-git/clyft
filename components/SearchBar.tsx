import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Modal,
  Image,
  Keyboard,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Fuse from 'fuse.js';
import { fetchSearchData } from './fetchSearchData';
import { BlurView } from 'expo-blur';

export default function LiveSearchBar() {
  const [query, setQuery] = useState('');
  const [fuse, setFuse] = useState<Fuse<any> | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const load = async () => {
      const items = await fetchSearchData();
      const fuseInstance = new Fuse(items, {
        keys: ['name', 'categoryName', 'subcategoryName'],
        threshold: 0.3,
      });
      setFuse(fuseInstance);
    };
    load();
  }, []);

  useEffect(() => {
    if (fuse && query.trim()) {
      const searchResults = fuse.search(query).map(r => r.item);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query]);

  const navigateToItem = (item: any) => {
    setQuery('');
    setFocused(false);
    Keyboard.dismiss();
    if (item.type === 'category') {
      router.push({
        pathname: '/subcategories/[categoryName]',
        params: {
          name: encodeURIComponent(item.name),
          categoryName: encodeURIComponent(item.name),
        },
      });
    } else if (item.type === 'subcategory') {
      router.push({
        pathname: '/widelisting/[subcategoryName]',
        params: {
          name: encodeURIComponent(item.name),
          category: encodeURIComponent(item.categoryName),
          subcategoryName: encodeURIComponent(item.name),
        },
      });
    } else if (item.type === 'widelisting') {
      router.push({
        pathname: '/Product_page',
        params: {
          name: item.name,
          subcategory: item.subcategoryName,
        },
      });
    }
  };

  return (
    <View style={{ zIndex: 9000, position: 'relative' }}>
      <View style={styles.searchContainer}>
        <TextInput
          ref={inputRef}
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            if (!focused) setFocused(true);
          }}
          onFocus={() => setFocused(true)}
          placeholder="Search for items..."
          style={styles.input}
          autoFocus={false}
        />
      </View>

      <Modal
        visible={focused}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setFocused(false);
          Keyboard.dismiss();
        }}
      >
        <Pressable
          style={styles.fullscreenContainer}
          onPress={() => {
            setFocused(false);
            Keyboard.dismiss();
          }}
        >
          <BlurView intensity={100} tint="dark" style={styles.blurOverlay} />
        </Pressable>

        <View pointerEvents="box-none" style={styles.overlayContent}>
          <View style={styles.searchContainerOverlay}>
            <TextInput
              ref={inputRef}
              value={query}
              onChangeText={(text) => setQuery(text)}
              autoFocus
              placeholder="Search for items..."
              style={styles.input}
            />
          </View>

          <View style={styles.resultBox}>
            <FlatList
              data={results}
              keyExtractor={(item, idx) => idx.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => navigateToItem(item)}
                  style={styles.resultItem}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.resultImage}
                  />
                  <Text style={styles.resultText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              keyboardShouldPersistTaps="always"
              keyboardDismissMode="on-drag"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#ccc',
    margin: 5,
    zIndex: 2,
  },
//   overlay should be positined above the seach bar but same dimensions

  searchContainerOverlay: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    marginTop: Platform.OS === 'android' ? 40 : 60,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  fullscreenContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  blurOverlay: {
    flex: 1,
  },
  overlayContent: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 2,
  },
  resultBox: {
    marginTop: 0,
    marginHorizontal: 16,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'rgb(255, 255, 255)',
    zIndex: 2,
    maxHeight: 400,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#bbb',
    borderBottomWidth: 0.5,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  resultText: {
    color: '#222',
    fontSize: 16,
    marginLeft: 10,
  },
  resultImage: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#999',
  },
});